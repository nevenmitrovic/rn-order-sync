import * as SecureStore from "expo-secure-store";

export async function saveAuthToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync("authToken", token);
  } catch (error) {
    console.error("Error saving auth token:", error);
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync("authToken");
    if (token) {
      return token;
    } else {
      console.log("No auth token found.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
}

export async function deleteAuthToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync("authToken");
  } catch (error) {
    console.error("Error deleting auth token:", error);
  }
}
