import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  getSession,
  submitArgument,
  getJudgement,
  submitAppeal,
  inviteUser,
  updateUsername,
  joinSession,
} from "../../utils/api";
import ArgumentForm from "../../components/ArgumentForm";
import ArgumentList from "../../components/ArgumentList";
import ChatBox from "../../components/ChatBox";
import InviteForm from "../../components/InviteForm";
import Judgement from "../../components/Judgement";
import AppealForm from "../../components/AppealForm";
import UsernameForm from "../../components/UsernameForm";

// Add this line to ensure _ is defined if it's being used
const _ = require("lodash");

export default function Session() {
  const router = useRouter();
  const { id } = router.query;
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("waiting");
  const [eventSource, setEventSource] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/session/${id}`;

  useEffect(() => {
    if (session) {
      if (!session.user2_id) {
        setSessionStatus("waiting");
      } else if (session.arguments.length < 2) {
        setSessionStatus("arguing");
      } else if (!session.judgement) {
        setSessionStatus("judging");
      } else if (!session.appeal_judgement) {
        setSessionStatus("appealing");
      } else {
        setSessionStatus("completed");
      }
    }
  }, [session]);

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

          // Check if the user needs to join the session
          if (sessionData.user1_id !== storedUserId && !sessionData.user2_id) {
            setIsJoining(true);
          }
        } catch (error) {
          console.error("Error fetching session:", error);
          alert("Failed to fetch session. Please try again.");
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
    if (id && !eventSource) {
      const newEventSource = new EventSource(`/api/events?sessionId=${id}`);

      newEventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received SSE message:", data);
        handleServerEvent(data);
      };

      newEventSource.onerror = (error) => {
        console.error("SSE error:", error);
        newEventSource.close();
      };

      setEventSource(newEventSource);

      return () => {
        if (newEventSource) {
          newEventSource.close();
        }
      };
    }
  }, [id, eventSource, handleServerEvent]);

  const handleServerEvent = useCallback((data) => {
    if (data.type === "newArgument") {
      addMessage(`${data.username} submitted an argument`);
      setSession((prevSession) => ({
        ...prevSession,
        arguments: [...(prevSession.arguments || []), data.argument],
      }));
    } else if (data.type === "judgementReady") {
      setSession((prevSession) => ({
        ...prevSession,
        judgement: data.judgement,
      }));
      addMessage(`Judgement received: ${data.judgement.winner} wins!`);
    }
  }, []);

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

  const handleJoinSession = async () => {
    try {
      const updatedSession = await joinSession(id, userId);
      setSession(updatedSession);
      setIsJoining(false);
    } catch (error) {
      console.error("Error joining session:", error);
      alert("Failed to join session. Please try again.");
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

      {isJoining && (
        <div>
          <p>
            You&apos;ve been invited to join this debate session. Would you like
            to join?
          </p>
          <button onClick={handleJoinSession}>Join Session</button>
        </div>
      )}

      {currentUser && (
        <UsernameForm
          currentUsername={session[`${currentUser}_name`]}
          onSubmit={handleUsernameUpdate}
        />
      )}

      {sessionStatus === "waiting" && (
        <InviteForm onEmailSubmit={handleInviteUser} inviteLink={inviteLink} />
      )}

      {sessionStatus === "arguing" && (
        <>
          <ArgumentList sessionArguments={session.arguments} />
          {canSubmitArgument && (
            <ArgumentForm onSubmit={handleArgumentSubmit} />
          )}
        </>
      )}

      {sessionStatus === "judging" && <div>Waiting for Judgement...</div>}

      {(sessionStatus === "appealing" || sessionStatus === "completed") && (
        <>
          <Judgement judgement={session.judgement} />
          {canAppeal && <AppealForm onSubmit={handleAppealSubmit} />}
        </>
      )}

      {sessionStatus === "completed" && session.appeal_judgement && (
        <Judgement judgement={session.appeal_judgement} />
      )}

      <ChatBox messages={messages} />
    </main>
  );
}
