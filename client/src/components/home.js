import React, { useEffect, useState } from "react";
// import Paper from "@material-ui/core/Paper";
// import InputBase from "@material-ui/core/InputBase";
// import IconButton from "@material-ui/core/IconButton";
// import SearchIcon from "@material-ui/icons/Search";
import Posts from "./posts";
import postService from "../services/postService";
import userService from "../services/userService";
import Loader from "react-loader-spinner";
import { Container, Grid, Typography } from "@material-ui/core";
import SearchInput from "./searchInput.";

const Home = ({ location, history }) => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const LoggedInUser = userService.getCurrentUser();
      if (LoggedInUser) {
        userService.getMyProfile().then(({ data }) => {
          if (data) {
            setCurrentUser(data);
          }
        });
      }

      postService.getAllPosts().then(({ data }) => {
        if (!data) {
          return;
        }
        setPosts(data);
        setIsLoading(false);
      });
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ paddingBottom: "20px" }}>
      <div
        style={{
          backgroundImage: "url(/images/hill-5260303_1920.jpg)",
          backgroundPosition: "top",
          backgroundSize: "cover",
          padding: "125px 15px 175px 15px",
        }}
      >
        <Grid
          style={{ marginTop: "20px" }}
          align="center"
          container
          spacing={1}
        >
          <Grid item xs={12}>
            <Typography
              style={{ fontSize: "40px", color: "white" }}
              variant="h3"
            >
              Pixa Verse
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              style={{ fontSize: "25px", color: "white" }}
              variant="h3"
            >
              Get, upload and share your favorite images
            </Typography>
          </Grid>
        </Grid>
        <SearchInput location={location} history={history} posts={posts} />
      </div>
      <div style={{ margin: "30px 15px 0px 15px" }}>
        {isLoading ? (
          <Loader
            style={{ textAlign: "center" }}
            type="TailSpin"
            color="#00BFFF"
            height={400}
            width={50}
            timeout={1000}
          />
        ) : (
          <Container disableGutters maxWidth="xl">
            <Posts currentUser={currentUser} posts={posts} />
          </Container>
        )}
      </div>
    </div>
  );
};

export default Home;
