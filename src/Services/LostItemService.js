import axios from "axios";
const LOST_URL = "http://localhost:9999/lost-found/lost";

export const lostItemSubmission = (lostItem) => {
  return axios.post(LOST_URL, lostItem);
};

export const getlostItemById = (id) => {
  return axios.get(LOST_URL + "/" + id);
};

export const deletelostItemById = (id) => {
  return axios.delete(LOST_URL + "/" + id);
};

export const lostitemIdGenerator = () => {
  return axios.get(LOST_URL + "/id-gen");
};

export const lostItemList = () => {
  return axios.get(LOST_URL);
};

export const lostItemListByUser = (username) => {
  return axios.get(LOST_URL + "/user/" + username);
};

export const updateLostItemStatus = (id, status) => {
  return axios.patch(LOST_URL + "/" + id + "/status", { status });
};

