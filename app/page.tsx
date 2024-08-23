"use client";

import { useState } from 'react';
import { usePathname, useSearchParams, redirect } from 'next/navigation';
import { createSession } from '../utils/api';
import { FormEvent, Suspense } from 'react';

export default function Home() {
  const pathname = usePathname();
  const [sessionName, setSessionName] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [joinSessionId, setJoinSessionId] = useState('');

  const handleCreateSession = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const newSession = await createSession(sessionName, sessionDescription);
      redirect(`/session/${newSession.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const handleJoinSession = (event: FormEvent) => {
    event.preventDefault();
    if (joinSessionId) {
      redirect(`/session/${joinSessionId}`);
    } else {
      alert('Please enter a valid session ID.');
    }
  };

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}> {/* Wrap in Suspense */}
        <h1>Welcome to AI Debate Judge</h1>

        <section>
          <h2>Create New Session</h2>
          <form onSubmit={handleCreateSession}>
            <div>
              const searchParams = useSearchParams(); 
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
      </Suspense>
    </main>
  );
}