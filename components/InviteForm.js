import { useState } from 'react';

export default function InviteForm({ onSubmit }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(email);
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Invite by Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <button type="submit">Invite User</button>
    </form>
  );
}