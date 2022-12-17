import { Grid } from "@material-ui/core";
import React, { Component } from "react";
import Post from "./posts/post";
import Loader from "react-loader-spinner";

class FeedPosts extends Component {
  state = {};
  render() {
    const { posts, currentUser } = this.props;

    return (
      <Grid
        style={{ marginTop: "30px" }}
        container
        justify="center"
        spacing={1}
      >
        {posts.length > 0 ? (
          posts.map((post) => (
            <Grid key={post._id} item>
              <Post currentUser={currentUser} post={post} />
            </Grid>
          ))
        ) : (
          <Loader
            type="TailSpin"
            color="#00BFFF"
            height={300}
            width={100}
            timeout={3000}
          />
        )}
      </Grid>
    );
  }
}
export default FeedPosts;
