import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ANDROID_CHANNEL_ID = "taskflow";

export async function initializeLocalNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      ANDROID_CHANNEL_ID,
      {
        name: "TaskFlow Notifications",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      }
    );
  }

  const permissions =
    await Notifications.getPermissionsAsync();

  if (!permissions.granted) {
    const permissionResponse =
      await Notifications.requestPermissionsAsync();

    return permissionResponse.granted;
  }

  return true;
}

type ShowLocalNotificationInput = {
  title: string;
  body: string;
};

export async function showLocalNotification({
  title,
  body,
}: ShowLocalNotificationInput) {
  const hasPermission =
    await initializeLocalNotifications();

  if (!hasPermission) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: null,
  });
}