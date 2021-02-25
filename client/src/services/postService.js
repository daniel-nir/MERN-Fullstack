import http from "./httpService";

export function getUserPosts(userId) {
  return http.get(`/api/posts/${userId}/user-posts`);
}

export function createPost(post) {
  return http.post("/api/posts", post);
}

export function getPost(postId) {
  return http.get(`/api/posts/${postId}/post`);
}

export function likePost(postId) {
  return http.put(`/api/posts/${postId}/like`);
}
export function unlikePost(postId) {
  return http.put(`/api/posts/${postId}/unlike`);
}

export function getMyPost(postId) {
  return http.get(`/api/posts/${postId}/my-post`);
}

export function setPost(post) {
  const { _id: postId, ...bodyPost } = post;
  return http.put(`/api/posts/${postId}/update-post`, bodyPost);
}

export function deletePost(postId) {
  return http.delete(`/api/posts/${postId}`);
}

export function getMyPosts() {
  return http.get("/api/posts/my-posts");
}

export function getAllPosts() {
  return http.get("/api/posts/posts");
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  createPost,
  getMyPosts,
  getMyPost,
  setPost,
  deletePost,
  getAllPosts,
  likePost,
  unlikePost,
  getPost,
  getUserPosts,
};
