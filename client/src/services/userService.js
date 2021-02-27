import http from "./httpService";
import jwtDecode from "jwt-decode";

const tokenKey = "token";

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

export function getUsers() {
  return http.get(`/api/user/users`);
}

export function getFavorites(favorites) {
  return http.get(`/api/user/${favorites}/favorites`);
}

export function addToFavorites(postId) {
  return http.put(`/api/user/${postId}/add-to-favorites`);
}
export function removeFromFavorites(postId) {
  return http.put(`/api/user/${postId}/remove-from-favorites`);
}

export function setUser(user) {
  const { ...bodyUser } = user;
  return http.put(`/api/user/update-user`, bodyUser);
}

export function getUserProfile(userId) {
  return http.get(`/api/user/${userId}/user-profile`);
}
export function getMyProfile(userId) {
  return http.get(`/api/user/${userId}/my-profile`);
}

export async function login(email, password) {
  const { data } = await http.post("/api/auth", {
    email,
    password,
  });
  localStorage.setItem(tokenKey, data.token);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login,
  logout,
  getCurrentUser,
  getJwt,
  getUsers,
  getMyProfile,
  getUserProfile,
  setUser,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
};
