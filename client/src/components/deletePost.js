import { useEffect } from "react";
import { toast } from "react-toastify";
import postService from "../services/postService";

const DeletePost = (props) => {
  useEffect(() => {
    const postId = props.match.params.id;
    postService.deletePost(postId);
    toast.info("post deleted");
    props.history.replace("/");
  });
  return null;
};
export default DeletePost;
