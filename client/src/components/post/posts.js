import { Grid } from "@material-ui/core";
import React from "react";
import Post from "../post/post";

const Posts = ({ posts, currentUser, history }) => {
  return (
    <Grid container spacing={3}>
      {posts.length > 0 &&
        posts.map((post) => (
          <Grid key={post._id} item md={4} sm={6} xs={12}>
            <Post currentUser={currentUser} post={post} history={history} />
          </Grid>
        ))}
    </Grid>
  );
};
export default Posts;
