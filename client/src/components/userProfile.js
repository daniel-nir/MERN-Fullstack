import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Posts from "./posts";
import userService from "../services/userService";
import postService from "../services/postService";
import { Container, Typography } from "@material-ui/core";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import LockIcon from "@material-ui/icons/Lock";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "25px",
  },
}));

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#1d262d",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const UserProfile = (props) => {
  const [userPosts, setUserPosts] = useState([]);
  const [favPosts, setFavPosts] = useState([]);
  const [user, setUser] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState([]);
  const [loggedIn, setLoggedIn] = useState("");

  useEffect(() => {
    const data = userService.getCurrentUser();
    setLoggedIn(data);
    setValue(0);
    if (data) {
      userService.getMyProfile().then(({ data }) => {
        if (data) {
          setCurrentUser(data);
        }
      });
    }

    const userId = props.match.params.id;
    userService
      .getUserProfile(userId)
      .then(({ data }) => {
        if (!data) return;
        setUser(data);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        } else return;
      });

    postService
      .getUserPosts(userId)
      .then(({ data }) => {
        if (!data) return;
        setUserPosts(data);
        const likesArrays = data.map((post) => post.postLikes);
        const likesMerged = [].concat.apply([], likesArrays);
        setTotalLikes(likesMerged);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        } else return;
      });
  }, [props.match.params.id]);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGetSaved = async () => {
    if (currentUser) {
      setIsLoading(true);
      const userId = props.match.params.id;
      await userService.getUserProfile(userId).then(({ data }) => {
        if (data.favorites.length === 0) {
          setFavPosts([]);
          setIsLoading(false);
          return;
        } else {
          userService.getFavorites(data.favorites).then(({ data }) => {
            setFavPosts(data);
            setIsLoading(false);
          });
        }
      });
    }
  };
  const handleGetPosts = async () => {
    setIsLoading(true);
    const userId = props.match.params.id;

    postService.getUserPosts(userId).then(({ data }) => {
      setUserPosts(data);
      setIsLoading(false);
    });
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Grid align="center">
        {loggedIn
          ? loggedIn._id === user._id && (
              <Container
                maxWidth="xl"
                style={{
                  position: "absolute",
                  textAlign: "right",
                  marginTop: "7px",
                }}
              >
                <Link
                  style={{
                    textDecoration: "none",
                  }}
                  to="/user-profile/edit"
                >
                  <Button size="small" variant="outlined">
                    edit user
                  </Button>
                </Link>
              </Container>
            )
          : null}
        <Typography
          style={{
            textTransform: "capitalize",
            marginTop: "100px",
            fontSize: "40px",
          }}
          variant="h3"
        >
          {user.name}
        </Typography>
        <Typography style={{ marginTop: "15px" }}>
          Member since
          <Moment format=" MMM. DD, YY">{user.createdAt}</Moment>
        </Typography>
        <Typography style={{ marginTop: "15px" }}>
          {userPosts.length === 1 ? (
            <>
              <b>{userPosts.length}</b>
              <span> post</span>
            </>
          ) : (
            <>
              <b>{userPosts.length}</b>
              <span> posts</span>
            </>
          )}

          <b style={{ marginLeft: "10px" }}>{totalLikes.length}</b>
          <span> likes</span>
        </Typography>
      </Grid>

      <Grid className={classes.root}>
        <StyledTabs value={value} onChange={handleChange} centered>
          <Tab
            disableRipple={true}
            label={"posts"}
            {...a11yProps(0)}
            onClick={handleGetPosts}
          />
          <Tab
            disableRipple={true}
            label={
              !loggedIn ? (
                <>
                  <div>
                    <LockIcon
                      fontSize="small"
                      style={{ marginBottom: "-4px" }}
                    />
                    saved
                  </div>
                </>
              ) : (
                "saved"
              )
            }
            {...a11yProps(1)}
            onClick={handleGetSaved}
          />
        </StyledTabs>
        <Divider variant="fullWidth" />

        <TabPanel
          className={classes.root}
          component="div"
          value={value}
          index={0}
        >
          {isLoading ? (
            <Loader
              style={{ textAlign: "center" }}
              type="TailSpin"
              color="#00BFFF"
              height={200}
              width={50}
              timeout={1500}
            />
          ) : (
            <Container maxWidth="lg">
              {userPosts.length > 0 ? (
                <Posts currentUser={currentUser} posts={userPosts} />
              ) : (
                <Typography style={{ textAlign: "center" }}>
                  wow, thats a very clean profile!
                </Typography>
              )}
            </Container>
          )}
        </TabPanel>
        <TabPanel
          className={classes.root}
          component="div"
          value={value}
          index={1}
        >
          {isLoading ? (
            <Loader
              style={{ textAlign: "center" }}
              type="TailSpin"
              color="#00BFFF"
              height={200}
              width={50}
              timeout={1500}
            />
          ) : (
            <>
              {currentUser ? (
                <Container maxWidth="lg">
                  {favPosts.length > 0 ? (
                    <Posts currentUser={currentUser} posts={favPosts} />
                  ) : (
                    <Typography style={{ textAlign: "center" }}>
                      no saved posts
                    </Typography>
                  )}
                </Container>
              ) : (
                <Typography style={{ textAlign: "center" }}>
                  This users saved posts are private and are currently hidden.
                </Typography>
              )}
            </>
          )}
        </TabPanel>
      </Grid>
    </Container>
  );
};

export default UserProfile;
