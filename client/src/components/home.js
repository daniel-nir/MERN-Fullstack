import React, { useEffect, useState } from "react";
import Posts from "./posts";
import postService from "../services/postService";
import userService from "../services/userService";
import Loader from "react-loader-spinner";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import SearchInput from "./searchInput.";

const useStyles = makeStyles((theme) => ({
  h: {
    textAlign: "left",
    fontSmooth: "auto",
    fontSize: "48px",
    color: "white",
    marginBottom: "10px",
    fontWeight: 600,

    [theme.breakpoints.down("xs")]: {
      maxWidth: 380,
    },
  },
}));

const Home = ({ location, history }) => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  // const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
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
        // random object from the data array
        // const random = Math.floor(Math.random() * data.length);
        // console.log(data[random].postImage);
        // setBackgroundImage(data[random].postImage);
        setPosts(data);
        setIsLoading(false);
      });
    }

    return () => setIsMounted(false);
  }, [isMounted]);

  return (
    <div style={{ paddingBottom: "20px" }}>
      <Container
        maxWidth="xl"
        style={{
          // backgroundImage: `url(http://localhost:3900/${backgroundImage})`,
          backgroundImage: `url(/images/snowPeak.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          padding: "140px 25px",
        }}
      >
        <Grid container justify="center">
          <Grid xs={12} align="center" item style={{ maxWidth: 870 }}>
            <Typography className={classes.h} variant="h1">
              pixaplace
            </Typography>
            <Typography
              className={classes.h}
              style={{
                fontSmooth: "auto",
                fontSize: "18px",
                color: "white",
              }}
            >
              photos for and by the people. sign up to share yours!
            </Typography>
          </Grid>
        </Grid>
        <Grid align="center" item>
          <SearchInput location={location} history={history} posts={posts} />
        </Grid>
        <Grid align="center" container>
          <Grid item xs={12}>
            <Typography style={{ margin: "25px", color: "#efefef" }}>
              example app
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <div style={{ margin: "15px 0px" }}>
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
          <Container maxWidth="lg" style={{ marginTop: "30px" }}>
            <Posts currentUser={currentUser} posts={posts} history={history} />
          </Container>
        )}
      </div>
    </div>
  );
};

export default Home;
