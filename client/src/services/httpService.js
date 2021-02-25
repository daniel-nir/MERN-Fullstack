import axios from "axios";
import userService from "./userService";

axios.defaults.headers.common["x-auth-token"] = userService.getJwt();

axios.interceptors.response.use(null, (error) => {
  const expectedError = error.response && error.response.status >= 403;

  if (expectedError) {
    return " ! An unexpected error occurred";
  }
  return Promise.reject(error);
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};
