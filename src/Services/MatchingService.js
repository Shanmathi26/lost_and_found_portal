import axios from 'axios';

const BASE_URL = 'http://localhost:9999/api';

export const getNotifiedUsersForFoundItem = (foundItemId) => {
  return axios.get(`${BASE_URL}/matches/notified-users/${foundItemId}`);
};

export const findMatchesWithAutoNotify = (foundItem) => {
  return axios.post(`${BASE_URL}/matches/find-with-notification`, foundItem);
};