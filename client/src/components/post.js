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
  Tooltip,
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
import { makeStyles, withStyles } from "@material-ui/core/styles";
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
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  paper: {
    marginRight: theme.spacing(10),
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },

  linkTop: {
    textDecoration: "none",
    color: "#fff",
    transition: ".3s",
    borderRadius: "2px!important",
    padding: "6px 6px!important",
    "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
    position: "absolute",
    left: "10px",
    top: "15px",
  },
  linkBottom: {
    textDecoration: "none",
    color: "#fff",
    transition: ".3s",
    borderRadius: "2px!important",
    padding: "6px 6px!important",
    "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
    marginRight: "6px",
  },
}));

const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    borderRadius: "0px",
    backgroundColor: "rgba(0,0,0,0.4)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 300,
    marginBottom: "0",
    transform: "none",
  },
}))(Tooltip);

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

  const handleLeaveListTile = () => {
    if (open === true) {
      setIsShown(true);
    } else {
      setIsShown(false);
    }
  };

  return (
    <div className={classes.root}>
      <GridList cellHeight={280} style={{ maxWidth: 500, padding: "0 1px " }}>
        <GridListTile
          style={{
            flex: "25%",
          }}
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={handleLeaveListTile}
        >
          <img
            src={`http://localhost:3900/${post.postImage}`}
            alt={post.postTags}
          />
          {isShown && (
            <>
              <Fade in={true}>
                <GridListTileBar
                  style={{
                    paddingTop: "15px",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.5) 0%, " +
                      "rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 100%)",
                  }}
                  titlePosition="bottom"
                  actionIcon={
                    <div style={{ whiteSpace: "nowrap" }}>
                      {currentUser ? (
                        <>
                          {isLiked ? (
                            <Grow in={true}>
                              <CustomTooltip placement="top" title="unlike">
                                <IconButton
                                  disableRipple
                                  onClick={handleUnlike}
                                  style={{
                                    marginBottom: "-1px",
                                    color: "#EE1D52",
                                    backgroundColor: "transparent",
                                  }}
                                  aria-label={`unlike`}
                                >
                                  <FavoriteIcon />
                                  <Typography
                                    variant="button"
                                    style={{ color: "white" }}
                                  >
                                    {likes.length || post.postLikes.length}
                                  </Typography>
                                </IconButton>
                              </CustomTooltip>
                            </Grow>
                          ) : (
                            <CustomTooltip placement="top" title="like">
                              <IconButton
                                disableRipple
                                onClick={handleLike}
                                style={{
                                  marginBottom: "-1px",
                                  color: "#fff",
                                  backgroundColor: "transparent",
                                }}
                                aria-label="like post"
                              >
                                <FavoriteBorderIcon />
                                <Typography
                                  variant="button"
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "transparent",
                                  }}
                                >
                                  {likes.length || post.postLikes.length}
                                </Typography>
                              </IconButton>
                            </CustomTooltip>
                          )}
                          {isFavorite ? (
                            <Grow in={true}>
                              <CustomTooltip placement="top" title="unsave">
                                <IconButton
                                  onClick={handleUnfavorite}
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "transparent",
                                  }}
                                  aria-label={`unfavorite ${user.name}`}
                                >
                                  <BookmarkIcon />
                                </IconButton>
                              </CustomTooltip>
                            </Grow>
                          ) : (
                            <CustomTooltip placement="top" title="save">
                              <IconButton
                                disableRipple
                                onClick={handleFavorite}
                                style={{ color: "white" }}
                                aria-label={`favorite ${user.name}`}
                              >
                                <BookmarkBorderIcon />
                              </IconButton>
                            </CustomTooltip>
                          )}
                        </>
                      ) : (
                        <Link style={{ textDecoration: "none" }} to="/login">
                          <IconButton
                            disableRipple
                            style={{ marginBottom: "-1px", color: "white" }}
                            aria-label={`star ${user.name}`}
                          >
                            <FavoriteBorderIcon />
                            <Typography variant="button">
                              {likes.length || post.postLikes.length}
                            </Typography>
                          </IconButton>
                          <IconButton
                            disableRipple
                            style={{ color: "white" }}
                            aria-label={`favorite ${user.name}`}
                          >
                            <BookmarkBorderIcon />
                          </IconButton>
                        </Link>
                      )}

                      {post.postTags.slice(0, 2).map((postTag, index) => (
                        <Link
                          key={index}
                          className={classes.linkBottom}
                          to={`/search?q=${postTag}`}
                        >
                          {postTag}
                        </Link>
                      ))}
                    </div>
                  }
                  actionPosition="left"
                />
              </Fade>

              <Fade in={true}>
                <GridListTileBar
                  style={{
                    top: "-5px",
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, " +
                      "rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 100%)",
                  }}
                  titlePosition="top"
                  subtitle={
                    <div style={{ margin: "40px 0 0 0px" }}>
                      {post.postText}
                    </div>
                  }
                  actionIcon={
                    <div style={{ whiteSpace: "nowrap" }}>
                      <Link
                        className={classes.linkTop}
                        to={`/user-profile/${post._user}`}
                      >
                        {user.name}
                      </Link>
                      <div className={classes.grow}></div>
                      <Moment
                        style={{
                          top: "10px",
                          color: "#fff",
                          margin: "12px 15px 0px 0px ",
                        }}
                        fromNow
                      >
                        {post.createdAt}
                      </Moment>
                      {currentUser ? (
                        <>
                          {currentUser._id === post._user ? (
                            <>
                              <IconButton
                                ref={anchorRef}
                                aria-controls={
                                  open ? "menu-list-grow" : undefined
                                }
                                aria-haspopup="true"
                                onClick={handleToggle}
                                style={{ color: "white" }}
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
