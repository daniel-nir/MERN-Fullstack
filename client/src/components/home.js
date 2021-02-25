import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Posts from "./posts";
import postService from "../services/postService";
import userService from "../services/userService";
import Loader from "react-loader-spinner";
import { Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "30px",
    padding: "2px 4px",
    display: "flex",
    margin: "auto",
    alignItems: "center",
    maxWidth: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    let mounted = true;
    const user = userService.getCurrentUser();
    if (user) {
      userService.getMyProfile().then(({ data }) => {
        if (!data) return;
        else setCurrentUser(data);
      });
    }

    postService.getAllPosts().then(({ data }) => {
      if (!data) {
        return;
      }
      if (mounted) {
        setPosts(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const classes = useStyles();

  const handleChange = (value) => {
    setSearchTerm(value);
    filterData(value);
    setIsFiltered(true);
  };

  const exclude = [
    "_id",
    "createdAt",
    "postText",
    "_user",
    "postLikes",
    "postImage",
    "postNumber",
    "__v",
  ];
  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === "") {
      setIsFiltered(false);
      setFiltered(posts);
    } else {
      const filteredData = posts.filter((item) => {
        return Object.keys(item).some((key) =>
          exclude.includes(key)
            ? false
            : item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });
      setFiltered(filteredData);
    }
  };

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
              Pixa Universe
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

        <Paper className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Search images by tags"
            value={searchTerm}
            onChange={(e) => handleChange(e.target.value)}
          />
          <IconButton className={classes.iconButton}>
            <SearchIcon />
          </IconButton>
        </Paper>
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
          <>
            {isFiltered ? (
              <Posts currentUser={currentUser} posts={filtered} />
            ) : (
              <Posts currentUser={currentUser} posts={posts} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
