export const createSession = async (name, description) => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
  }

  const response = await fetch(`/api/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description, userId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
};

export const getSession = async (id) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    throw new Error("User ID not found in local storage");
  }
  try {
    const response = await fetch(`/api/sessions/${id}?userId=${userId}`);
    let errorData;
    try {
      errorData = await response.json();
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      throw new Error(`Failed to parse response: ${response.statusText}`);
    }
    if (!response.ok) {
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }
    return errorData;
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
};

export const joinSession = async (sessionId, userId) => {
  const response = await fetch(`/api/sessions/${sessionId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
};

export const submitArgument = async (sessionId, content, imageFile) => {
  const formData = new FormData();
  formData.append("content", content);
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const userId = localStorage.getItem("userId");
  const response = await fetch(
    `/api/sessions/${sessionId}/arguments/?userId=${userId}`,
    {
      method: "POST",
      body: formData,
    },
  );
  return response.json();
};

export const getJudgement = async (sessionId) => {
  const response = await fetch(`/api/sessions/${sessionId}/judge/`);
  return response.json();
};

export const submitAppeal = async (sessionId, content) => {
  const userId = localStorage.getItem("userId");
  const response = await fetch(`/api/sessions/${sessionId}/appeal/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, user_id: userId }),
  });
  return response.json();
};

export const inviteUser = async (sessionId, email) => {
  const userId = localStorage.getItem("userId");
  const response = await fetch(`/api/sessions/${sessionId}/invite/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, userId }),
  });
  return response.json();
};

export const updateUsername = async (sessionId, user, username) => {
  const userId = localStorage.getItem("userId");
  const response = await fetch(`/api/sessions/${sessionId}/update_username`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user, username, userId }),
  });
  return response.json();
};
