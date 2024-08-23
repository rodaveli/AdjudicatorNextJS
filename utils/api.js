const API_URL = 'http://localhost:8000'; // Replace with your backend URL

export const createSession = async (name, description) => {
  const response = await fetch(`${API_URL}/sessions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  return response.json();
};

export const getSession = async (id) => {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`${API_URL}/sessions/${id}?userId=${userId}`);
  return response.json();
};

export const submitArgument = async (sessionId, content, imageFile) => {
  const formData = new FormData();
  formData.append('content', content);
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const userId = localStorage.getItem('userId');
  const response = await fetch(`${API_URL}/sessions/${sessionId}/arguments/?userId=${userId}`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const getJudgement = async (sessionId) => {
  const response = await fetch(`${API_URL}/sessions/${sessionId}/judge/`);
  return response.json();
};

export const submitAppeal = async (sessionId, content) => {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`${API_URL}/sessions/${sessionId}/appeal/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, user_id: userId }),
  });
  return response.json();
};

export const inviteUser = async (sessionId, email) => {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`${API_URL}/sessions/${sessionId}/invite/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, userId }),
  });
  return response.json();
};

export const updateUsername = async (sessionId, user, username) => {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`${API_URL}/sessions/${sessionId}/update_username`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, username, userId }),
  });
  return response.json();
};