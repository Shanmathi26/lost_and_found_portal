import axios from "axios";
const FOUND_URL = "http://localhost:9999/lost-found/found";

export const foundItemSubmission = (foundItem) => {
  return axios.post(FOUND_URL, foundItem);
};

export const getfoundItemById = (id) => {
  return axios.get(FOUND_URL + "/" + id);
};

export const deletefoundItemById = (id) => {
  return axios.delete(FOUND_URL + "/" + id);
};

export const founditemIdGenerator = () => {
  return axios.get(FOUND_URL + "/id-gen");
};

export const foundItemList = () => {
  return axios.get(FOUND_URL);
};

export const foundItemListByUser = (username) => {
  return axios.get(FOUND_URL + "/user/" + username);
};

export const updateFoundItemStatus = (id, status) => {
  return axios.patch(FOUND_URL + "/" + id + "/status", { status });
};