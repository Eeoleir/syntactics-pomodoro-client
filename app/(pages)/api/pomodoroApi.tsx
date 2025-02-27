

export const fetchPomodoroSettings = async () => {
  const response = await fetch('/api/pomodoro-settings');
  if (!response.ok) {
    throw new Error('Failed to fetch pomodoro settings');
  }
  const data = await response.json();
  return data[0]; 
};

export const updatePomodoroSettings = async (settings: any) => {
  const response = await fetch('/api/pomodoro-settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    throw new Error('Failed to update pomodoro settings');
  }
  return response.json();
};