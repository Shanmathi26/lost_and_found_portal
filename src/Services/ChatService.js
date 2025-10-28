import axios from 'axios';

const BASE_URL = 'http://localhost:9999/api/chat';

export const getMessages = (user1, user2) => {
  return axios.get(`${BASE_URL}/messages/${user1}/${user2}`);
};

export const sendMessage = (message) => {
  return axios.post(`${BASE_URL}/send`, message);
};

export const getUserConversations = (username) => {
  return axios.get(`${BASE_URL}/conversations/${username}`);
};