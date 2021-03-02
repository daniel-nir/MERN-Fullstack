import { Grid } from "@material-ui/core";
import React from "react";
import Post from "./post";

const Posts = ({ posts, currentUser }) => {
  return (
    <Grid container spacing={3}>
      {posts.length > 0 &&
        posts.map((post) => (
          <Grid key={post._id} item md={4} sm={6} xs={12}>
            <Post currentUser={currentUser} post={post} />
          </Grid>
        ))}
    </Grid>
  );
};
export default Posts;
