import { Grid } from "@material-ui/core";
import React from "react";
import Post from "./post";

const Posts = ({ posts, currentUser }) => {
  return (
    <>
      <Grid container justify="center" spacing={1}>
        {posts.length > 0 &&
          posts.map((post) => (
            <Grid key={post._id} item>
              <Post currentUser={currentUser} post={post} />
            </Grid>
          ))}
      </Grid>
    </>
  );
};
export default Posts;
