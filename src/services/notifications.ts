// Placeholder para notificaciones
// Estructura lista para Firebase Cloud Messaging o Expo Notifications v2

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const notificationService = {
  async notifyNewChatMessage(senderName: string, message: string): Promise<void> {
    await notificationService.sendLocalNotification('Nuevo mensaje', `${senderName}: ${message}`);
  },
  async registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B6B',
      });
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return undefined;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  },

  listenForNotifications(onNotification: (notification: Notifications.Notification) => void) {
    Notifications.addNotificationReceivedListener(onNotification);
  },

  async sendLocalNotification(title: string, body: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null,
    });
  },

  // Tipos de notificaciones a implementar
  async notifyMatch(dogName: string, ownerName: string): Promise<void> {
    await notificationService.sendLocalNotification('¡Nuevo Match!', `${ownerName} hizo match con ${dogName}`);
  },

  async notifyLostDogAlert(dogName: string): Promise<void> {
    await notificationService.sendLocalNotification('Alerta de perro perdido', `Se ha reportado perdido: ${dogName}`);
  },

  async notifyNewFollower(userName: string): Promise<void> {
    await notificationService.sendLocalNotification('Nuevo seguidor', `${userName} ahora te sigue.`);
  },
};
