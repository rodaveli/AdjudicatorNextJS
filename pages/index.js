import { useState } from "react";
import { useRouter } from "next/router";
import { createSession } from "../utils/api";

export default function Home() {
  const router = useRouter();
  const [sessionName, setSessionName] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [joinSessionId, setJoinSessionId] = useState("");

  const handleCreateSession = async (event) => {
    event.preventDefault();
    try {
      console.log("Creating session...");
      const newSession = await createSession(sessionName, sessionDescription);
      console.log("Session created:", newSession);
      router.push(`/session/${newSession.id}`);
    } catch (error) {
      console.error("Error creating session:", error);
      alert(`Failed to create session: ${error.message}`);
    }
  };

  const handleJoinSession = (event) => {
    event.preventDefault();
    if (joinSessionId) {
      router.push(`/session/${joinSessionId}`);
    } else {
      alert("Please enter a valid session ID.");
    }
  };

  return (
    <main>
      <h1>Welcome to AI Debate Judge</h1>

      <section>
        <h2>Create New Session</h2>
        <form onSubmit={handleCreateSession}>
          <div>
            <label htmlFor="sessionName">Session Name:</label>
            <input
              id="sessionName"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="sessionDescription">Description:</label>
            <textarea
              id="sessionDescription"
              value={sessionDescription}
              onChange={(e) => setSessionDescription(e.target.value)}
            />
          </div>
          <button type="submit">Create Session</button>
        </form>
      </section>

      <section>
        <h2>Join Existing Session</h2>
        <form onSubmit={handleJoinSession}>
          <div>
            <label htmlFor="joinSessionId">Session ID:</label>
            <input
              id="joinSessionId"
              value={joinSessionId}
              onChange={(e) => setJoinSessionId(e.target.value)}
              required
            />
          </div>
          <button type="submit">Join Session</button>
        </form>
      </section>
    </main>
  );
}
