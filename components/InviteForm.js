import { useState } from "react";

export default function InviteForm({ onEmailSubmit, inviteLink }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onEmailSubmit(email);
    setEmail("");
  };

  const copyInviteLink = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        alert("Invite link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Invite by Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Invite User</button>
      </form>
      <div>
        <input type="text" value={inviteLink} readOnly />
        <button onClick={copyInviteLink}>Copy Invite Link</button>
      </div>
    </div>
  );
}
