import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const sendNotification = (notification) => {
  return axios.post(`${BASE_URL}/notifications`, notification);
};

export const getUserNotifications = (username) => {
  return axios.get(`${BASE_URL}/notifications/user/${username}`);
};

export const markNotificationAsRead = (notificationId) => {
  return axios.patch(`${BASE_URL}/notifications/${notificationId}/read`);
};

export const deleteNotification = (notificationId) => {
  return axios.delete(`${BASE_URL}/notifications/${notificationId}`);
};

// Configuration for minimum confidence score to send notifications
const MIN_CONFIDENCE_THRESHOLD = 70; // Only send notifications for matches with 70% or higher confidence

// Enhanced matching service with notification
export const findMatchesWithNotification = (foundItem) => {
  return axios.post(`${BASE_URL}/matches/find-with-notification`, {
    ...foundItem,
    minConfidenceThreshold: MIN_CONFIDENCE_THRESHOLD
  });
};