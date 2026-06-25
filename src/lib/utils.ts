import { Platform, Alert } from 'react-native';

/**
 * Cross-platform alert utility.
 * Uses native Alert.alert on iOS/Android, and window.alert on web.
 */
export function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

/**
 * A wrapper around fetch that automatically prepends the API URL
 * and handles common error responses.
 */
export async function apiClient(endpoint: string, options?: RequestInit) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || '';
  const url = `${baseUrl}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `API request failed with status ${response.status}`);
  }

  return data;
}
