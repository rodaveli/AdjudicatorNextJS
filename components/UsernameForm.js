import { useState } from 'react';

export default function UsernameForm({ currentUsername, onSubmit }) {
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUsername);

  const handleEditClick = () => {
    setEditingUsername(true);
  };

  const handleSaveClick = () => {
    onSubmit(newUsername);
    setEditingUsername(false);
  };

  return (
    <div className="user-info">
      {editingUsername ? (
        <>
          <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          <button onClick={handleSaveClick}>Save</button>
        </>
      ) : (
        <>
          <p>Your username: {currentUsername}</p>
          <button onClick={handleEditClick}>Edit</button>
        </>
      )}
    </div>
  );
}