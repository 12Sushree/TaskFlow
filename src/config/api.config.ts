import { Platform } from "react-native";

/**
 * Base URL for the TaskFlow API.
 * 10.0.2.2 is the special IP address to access the host machine from the Android emulator.
 * localhost works for iOS simulators and web.
 */
export const API_BASE_URL = Platform.select({
  android: "http://10.0.2.2:3000/api",
  default: "http://localhost:3000/api",
});

export const STORAGE_KEYS = {
  AUTH_TOKEN: "@taskflow/auth_token",
  USER_DATA: "@taskflow/user_data",
};
