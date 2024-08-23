import { useState } from 'react';

export default function AppealForm({ onSubmit }) {
  const [appealContent, setAppealContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(appealContent);
    setAppealContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="appeal">Your Appeal:</label>
        <textarea id="appeal" value={appealContent} onChange={(e) => setAppealContent(e.target.value)} required />
      </div>
      <button type="submit">Submit Appeal</button>
    </form>
  );
}