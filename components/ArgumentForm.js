import { useState } from 'react';

export default function ArgumentForm({ onSubmit }) {
  const [argument, setArgument] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(sessionArguments, imageFile);
    setArgument('');
    setImageFile(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="argument">Your Argument:</label>
        <textarea id="argument" value={sessionArguments} onChange={(e) => setArgument(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="image">Upload Image (optional):</label>
        <input type="file" id="image" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
      </div>
      <button type="submit">Submit Argument</button>
    </form>
  );
}