import {
  GridListTile,
  GridListTileBar,
  IconButton,
  Typography,
  MenuList,
  MenuItem,
  Paper,
  Grow,
  Popper,
  ClickAwayListener,
  Button,
  GridList,
  Fade,
} from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import userService from "../services/userService";
import postService from "../services/postService";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Moment from "react-moment";

const useStyles = makeStyles((theme) => ({
  bar: {
    position: "absolute",
    top: "0",
    height: "100%",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
  },

  linkTop: {
    textDecoration: "none",
    color: "#fff",
    transition: ".3s",
    borderRadius: "2px!important",
    padding: "4px 6px!important",
    "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
    position: "absolute",
    left: "8px",
    top: "8px",
  },
  linkL: {
    textDecoration: "none",
    color: "#fff",
    transition: ".3s",
    borderRadius: "2px!important",
    padding: "4px 6px!important",
    marginRight: "6px",
    "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
  },

  linkR: {
    textDecoration: "none",
    color: "#fff",
    transition: ".3s",
    borderRadius: "2px!important",
    padding: "4px 6px!important",
    marginLeft: "6px",
    "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
  },

  linkBtns: {
    color: "#fff",
    transition: ".3s",
    borderRadius: "2px!important",
    marginLeft: "6px",
    "&:hover": { color: "#ddd!important" },
  },

  liked: {
    color: "#f15151",
    transition: ".3s",
    "&:hover": { color: "#a93807!important" },
  },

  action: {
    position: "absolute",
    left: "8px",
    bottom: "8px",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Post = ({ post, currentUser, history }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const anchorRef = useRef(null);
  const [user, setUser] = useState({});
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState();
  const [isFavorite, setIsFavorite] = useState();
  const [isShown, setIsShown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
      const postId = post._id;
      const author = post._user;
      userService.getUserProfile(author).then(({ data }) => {
        setUser(data);
      });

      postService.getPost(postId).then(({ data }) => {
        if (!currentUser || !post || !data) {
          return;
        }
        const likesArray = data.postLikes;
        setIsLiked(likesArray.includes(currentUser._id));
      });
      if (currentUser) {
        userService.getUserProfile(currentUser._id).then(({ data }) => {
          const favArray = data.favorites;
          setIsFavorite(favArray.includes(post._id));
        });
      }
    }
    return () => {
      setIsMounted(false);
    };
  }, [currentUser, isMounted, post, post._id, post._user, post.postLikes]);

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClickClose = () => {
    setOpenDialog(false);
    setIsShown(true);
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleLike = async () => {
    const postId = post._id;
    postService.likePost(postId).then(({ data }) => {
      const newLikes = data.postLikes;
      setLikes(newLikes);
      setIsLiked(true);
    });
  };
  const handleUnlike = async () => {
    const postId = post._id;
    await postService.unlikePost(postId).then(({ data }) => {
      setIsLiked(false);
      setLikes(data.postLikes);
    });
  };

  const handleFavorite = async () => {
    const postId = post._id;
    await userService.addToFavorites(postId);
    setIsFavorite(true);
  };
  const handleUnfavorite = async () => {
    const postId = post._id;
    await userService.removeFromFavorites(postId);
    setIsFavorite(false);
  };

  const handleMouseLeave = () => {
    if (open === true) {
      setIsShown(true);
    } else {
      setIsShown(false);
    }
  };

  const handleMouseEnter = () => {
    setIsShown(true);
  };

  return (
    <div>
      <GridList cellHeight={"400"}>
        <GridListTile
          style={{
            flex: "25%",
            width: "100%",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            style={{
              height: "100%",
              width: "100%",
              display: "block",
              objectFit: "cover",
            }}
            src={`http://localhost:3900/${post.postImage}`}
            alt={post.postTags}
          />
          {isShown && (
            <>
              <Fade in={true}>
                <Link to="#">
                  <GridListTileBar
                    className={classes.bar}
                    titlePosition="bottom"
                    subtitle={
                      <Moment
                        style={{
                          position: "absolute",
                          top: "38px",
                          left: "15px",
                          color: "#fff",
                        }}
                        fromNow
                      >
                        {post.createdAt}
                      </Moment>
                    }
                    actionIcon={
                      <div>
                        <div className={classes.action}>
                          <div
                            style={{
                              alignSelf: "flex-end",
                            }}
                          >
                            {post.postTags.slice(0, 5).map((postTag, index) => (
                              <Link
                                key={index}
                                className={classes.linkL}
                                to={`/search?q=${postTag}`}
                                style={{ float: "left" }}
                              >
                                {postTag}
                              </Link>
                            ))}
                          </div>
                          <div
                            style={{
                              alignSelf: "flex-end",
                              whiteSpace: "nowrap",
                              marginRight: "16px",
                            }}
                          >
                            {currentUser ? (
                              <>
                                {isLiked ? (
                                  <IconButton
                                    className={
                                      (classes.linkBtns, classes.liked)
                                    }
                                    style={{
                                      backgroundColor: "transparent",
                                    }}
                                    size="small"
                                    onClick={handleUnlike}
                                    aria-label="unlike"
                                  >
                                    <FavoriteIcon />
                                    <Typography
                                      variant="button"
                                      style={{ color: "#fff" }}
                                    >
                                      {likes.length || post.postLikes.length}
                                    </Typography>
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    className={classes.linkBtns}
                                    size="small"
                                    onClick={handleLike}
                                    aria-label="like post"
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <FavoriteBorderIcon />
                                    <Typography
                                      variant="button"
                                      style={{
                                        color: "#fff",
                                      }}
                                    >
                                      {likes.length || post.postLikes.length}
                                    </Typography>
                                  </IconButton>
                                )}
                                {isFavorite ? (
                                  <IconButton
                                    className={classes.linkBtns}
                                    size="small"
                                    onClick={handleUnfavorite}
                                    style={{ backgroundColor: "transparent" }}
                                    aria-label={`unfavorite ${user.name}`}
                                  >
                                    <BookmarkIcon />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    className={classes.linkBtns}
                                    size="small"
                                    onClick={handleFavorite}
                                    aria-label={`favorite ${user.name}`}
                                  >
                                    <BookmarkBorderIcon />
                                  </IconButton>
                                )}
                              </>
                            ) : (
                              <Link
                                style={{ textDecoration: "none" }}
                                to="/login"
                              >
                                <IconButton
                                  className={classes.linkBtns}
                                  size="small"
                                  aria-label={`star ${user.name}`}
                                  style={{ backgroundColor: "transparent" }}
                                >
                                  <FavoriteBorderIcon />
                                  <Typography variant="button">
                                    {likes.length || post.postLikes.length}
                                  </Typography>
                                </IconButton>
                                <IconButton
                                  className={classes.linkBtns}
                                  size="small"
                                  aria-label={`favorite ${user.name}`}
                                  style={{ backgroundColor: "transparent" }}
                                >
                                  <BookmarkBorderIcon />
                                </IconButton>
                              </Link>
                            )}
                          </div>
                        </div>
                        <Link
                          className={classes.linkTop}
                          to={`/user-profile/${post._user}`}
                        >
                          {user.name}
                        </Link>

                        {currentUser ? (
                          <>
                            {currentUser._id === post._user ? (
                              <>
                                <IconButton
                                  className={classes.linkBtns}
                                  size="small"
                                  ref={anchorRef}
                                  aria-controls={
                                    open ? "menu-list-grow" : undefined
                                  }
                                  aria-haspopup="true"
                                  onClick={handleToggle}
                                  style={{
                                    position: "absolute",
                                    color: "white",
                                    top: "8px",
                                    right: "8px",
                                  }}
                                  aria-label="more"
                                >
                                  <MoreHorizIcon />
                                </IconButton>
                              </>
                            ) : null}
                          </>
                        ) : null}
                      </div>
                    }
                  />
                </Link>
              </Fade>

              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === "bottom",
                    }}
                  >
                    <Paper className={classes.paper}>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDown}
                        >
                          <Link
                            style={{ textDecoration: "none", color: "#333" }}
                            to={`/user-profile/edit-post/${post._id}`}
                          >
                            <MenuItem onClick={handleClose}>
                              <EditIcon fontSize="small" /> edit
                            </MenuItem>
                          </Link>

                          <MenuItem onClick={handleClickOpen}>
                            <Typography color="error">
                              <DeleteForeverIcon
                                style={{ marginBottom: "-7px" }}
                              />
                              delete
                            </Typography>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </>
          )}
        </GridListTile>
      </GridList>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Are you sure ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            do you want to proceed and delete this post? Please note that it
            can't be undone therafter
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClickClose} color="primary">
            cancel
          </Button>
          <Link
            to={`/user-profile/delete-post/${post._id}`}
            style={{ textDecoration: "none" }}
            onClick={handleClickOpen}
          >
            <Button variant="outlined" onClick={handleClickClose}>
              <Typography variant="button" color="error">
                delete
              </Typography>
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Post;
