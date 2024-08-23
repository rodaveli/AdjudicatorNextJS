import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getSession,
  submitArgument,
  getJudgement,
  submitAppeal,
  inviteUser,
  updateUsername,
} from "../../utils/api";
import ArgumentForm from "../../components/ArgumentForm";
import ArgumentList from "../../components/ArgumentList";
import ChatBox from "../../components/ChatBox";
import InviteForm from "../../components/InviteForm";
import Judgement from "../../components/Judgement";
import AppealForm from "../../components/AppealForm";
import UsernameForm from "../../components/UsernameForm";

export default function Session() {
  const router = useRouter();
  const { id } = router.query;
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (router.isReady && id) {
        try {
          const sessionData = await getSession(id);
          setSession(sessionData);

          const storedUserId = localStorage.getItem("userId");
          if (storedUserId) {
            setUserId(storedUserId);
          } else {
            const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("userId", newUserId);
            setUserId(newUserId);
          }
        } catch (error) {
          console.error("Error fetching session:", error);
          // Handle the error (e.g., show an error message)
        }
      }
    };

    fetchSession();
  }, [router.isReady, id]);

  useEffect(() => {
    if (session && userId) {
      setCurrentUser(
        userId === session.user1_id
          ? "user1"
          : userId === session.user2_id
            ? "user2"
            : null,
      );
    }
  }, [session, userId]);

  useEffect(() => {
    if (id) {
      const newSocket = new WebSocket(`ws://localhost:8000/ws/${id}`);

      newSocket.onopen = () => console.log("WebSocket connection opened");
      newSocket.onclose = (event) => {
        console.log("WebSocket connection closed", event);
        // Implement reconnection logic if needed
      };
      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Handle the error (e.g., show a message to the user)
      };
      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket message:", data);
          if (data.message === "New argument submitted") {
            addMessage(
              `${session[`${currentUser}_name`]} submitted an argument`,
            );
            if (data.argumentCount === 2) {
              addMessage("Both arguments submitted. Waiting for judgement...");
            }
            setSession((prevSession) => ({
              ...prevSession,
              arguments: [...(prevSession.arguments || []), data.argument],
            }));
          } else if (data.message === "Judgement ready") {
            console.log("Received judgement:", data.judgement);
            setSession((prevSession) => ({
              ...prevSession,
              judgement: data.judgement,
            }));
            addMessage(`Judgement received: ${data.judgement.winner} wins!`);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      setSocket(newSocket);

      return () => {
        if (newSocket && newSocket.readyState === WebSocket.OPEN) {
          newSocket.close();
        }
      };
    }
  }, [id, session, currentUser]);

  const handleArgumentSubmit = async (argument, imageFile) => {
    try {
      await submitArgument(id, argument, imageFile);
      addMessage(`${session[`${currentUser}_name`]} submitted an argument`);
    } catch (error) {
      console.error("Error submitting argument:", error);
      alert("Failed to submit argument. Please try again.");
    }
  };

  const handleAppealSubmit = async (appealContent) => {
    try {
      await submitAppeal(id, appealContent);
      addMessage(`${session[`${currentUser}_name`]} submitted an appeal`);
    } catch (error) {
      console.error("Error submitting appeal:", error);
      alert("Failed to submit appeal. Please try again.");
    }
  };

  const handleInviteUser = async (email) => {
    try {
      await inviteUser(id, email);
      alert("User invited successfully!");
    } catch (error) {
      console.error("Error inviting user:", error);
      alert("Failed to invite user. Please try again.");
    }
  };

  const handleUsernameUpdate = async (username) => {
    try {
      const updatedSession = await updateUsername(id, currentUser, username);
      setSession(updatedSession);
    } catch (error) {
      console.error("Error updating username:", error);
      alert("Failed to update username. Please try again.");
    }
  };

  const addMessage = (content) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { content, timestamp: new Date() },
    ]);
  };

  const canSubmitArgument = session?.arguments && session.arguments.length < 2;
  const canGetJudgement =
    session?.arguments && session.arguments.length === 2 && !session?.judgement;
  const canAppeal =
    session?.judgement &&
    session.judgement.loser === session[`${currentUser}_name`] &&
    !session.appeal_judgement;

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>{session.name}</h1>
      <p>{session.description}</p>

      <UsernameForm
        currentUsername={session[`${currentUser}_name`]}
        onSubmit={handleUsernameUpdate}
      />

      {session.judgement && <Judgement judgement={session.judgement} />}
      {canAppeal && <AppealForm onSubmit={handleAppealSubmit} />}
      {session.appeal_judgement && (
        <Judgement judgement={session.appeal_judgement} />
      )}

      <ChatBox messages={messages} />
      <InviteForm onSubmit={handleInviteUser} />
      <ArgumentList arguments={session.arguments} />
      {canSubmitArgument && <ArgumentForm onSubmit={handleArgumentSubmit} />}
      {canGetJudgement && <div>Waiting for Judgement...</div>}
    </main>
  );
}
