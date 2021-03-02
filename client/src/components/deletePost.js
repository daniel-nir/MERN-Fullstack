import { useEffect } from "react";
import { toast } from "react-toastify";
import postService from "../services/postService";
import userService from "../services/userService";

const DeletePost = ({ match, history }) => {
  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    const postId = match.params.id;
    postService.deletePost(postId);
    toast.info("post deleted");
    history.replace(`/user-profile/${currentUser._id}`);
  });
  return null;
};
export default DeletePost;
