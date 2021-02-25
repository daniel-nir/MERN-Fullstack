import React, { useEffect, useState } from "react";
import PageHeader from "./pageHeader";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import SettingsIcon from "@material-ui/icons/Settings";
import Posts from "./posts";
import userService from "../services/userService";
import postService from "../services/postService";
import { IconButton, Typography } from "@material-ui/core";
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
    backgroundColor: theme.palette.background.paper,
    marginTop: "70px",
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
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const UserProfile = (props) => {
  const [userPosts, setUserPosts] = useState([]);
  const [favPosts, setFavPosts] = useState([]);
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState([]);

  useEffect(() => {
    const data = userService.getCurrentUser();
    if (data) {
      userService.getMyProfile().then(({ data }) => {
        setCurrentUser(data);
      });
    }
    const userId = props.match.params.id;
    userService
      .getUserProfile(userId)
      .then(({ data }) => {
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
    const userId = props.match.params.id;
    if (!currentUser) return;
    else
      await userService.getUserProfile(userId).then(({ data }) => {
        if (data.favorites.length === 0) {
          setFavPosts([]);
          return;
        } else {
          userService.getFavorites(data.favorites).then(({ data }) => {
            setFavPosts(data);
          });
        }
      });
  };

  return (
    <div style={{ padding: "15px" }}>
      <PageHeader
        title={user.name}
        sub={
          <>
            <Typography style={{ marginTop: "15px" }}>
              Member since{"  "}
              <Moment format="MMM. DD, YY">{user.createdAt}</Moment>
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
          </>
        }
      />

      {currentUser._id === user._id && (
        <div style={{ textAlign: "right", paddingRight: "30px" }}>
          <IconButton>
            <SettingsIcon fontSize="small" />
          </IconButton>
          <Link
            style={{
              textDecoration: "none",
            }}
            to="/user-profile/edit"
          >
            <Button>edit user</Button>
          </Link>
        </div>
      )}

      <Grid className={classes.root}>
        <StyledTabs value={value} onChange={handleChange} centered>
          <Tab disableRipple={true} label={"posts"} {...a11yProps(0)} />
          <Tab
            disableRipple={true}
            label={
              !currentUser ? (
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
        <Divider variant="middle" />

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
              timeout={1000}
            />
          ) : (
            <Posts currentUser={currentUser} posts={userPosts} />
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
              timeout={1000}
            />
          ) : (
            <>
              {currentUser ? (
                <Posts currentUser={currentUser} posts={favPosts} />
              ) : (
                <Typography style={{ textAlign: "center" }}>
                  this users saved posts are private and are currently hidden
                </Typography>
              )}
            </>
          )}
        </TabPanel>
      </Grid>
    </div>
  );
};

export default UserProfile;
