import * as SecureStore from "expo-secure-store";

export const API_URL = "http://192.168.0.104:3000";

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Не удалось войти");
  }

  await SecureStore.setItemAsync("accessToken", data.accessToken);
  return data.user;
}

export async function register(
  email: string,
  password: string,
  displayName: string,
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join("\n")
        : data.message ?? "Не удалось зарегистрироваться",
    );
  }

  return data;
}