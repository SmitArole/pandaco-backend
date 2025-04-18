// src/api.js
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Example usage in your React component:
// import { testConnection } from './api';
// 
// useEffect(() => {
//   testConnection()
//     .then(data => console.log('Success:', data))
//     .catch(error => console.error('Error:', error));
// }, []);
