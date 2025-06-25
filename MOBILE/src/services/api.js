import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://localhost:3000/api";

async function getToken() {
  return await AsyncStorage.getItem('token');
}

export async function apiFetch(endpoint, options = {}) {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) throw data;
  return data;
}