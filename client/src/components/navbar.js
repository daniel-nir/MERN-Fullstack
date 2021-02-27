import React, { useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import PersonIcon from "@material-ui/icons/Person";
import { NavLink } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { withRouter } from "react-router-dom";
import AddPostBtn from "./addPostBtn";
import {
  Container,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import SearchBar from "./searchBar";

const useStyles = makeStyles((theme) => ({
  xs_down: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  xs_up: {
    [theme.breakpoints.up("xs")]: {
      display: "none",
    },
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    margin: "0 15px!important",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "300px",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),

    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Navbar = ({ currentUser, userUpdated, history, window, location }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isShown, setIsShown] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
      const params = new URLSearchParams(location.search);

      const q = params.get("q");
      setIsShown(q === "" || q);
    }

    return () => setIsMounted(false);
  }, [isMounted, location.search]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div style={{ width: 240 }} onClick={() => setMobileOpen(false)}>
      {currentUser ? (
        <List>
          <ListItem button key="3">
            <ListItemText
              style={{ margin: "0px 45px" }}
              primary={<AddPostBtn />}
            />
          </ListItem>
          <NavLink
            style={{ textDecoration: "none", color: "#1976d2" }}
            to={`/user-profile/${currentUser._id}`}
          >
            <ListItem button key="1">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={`hi, ${currentUser.name}`} />
            </ListItem>
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "#1976d2" }}
            to="/logout"
          >
            <ListItem button key="2">
              <ListItemIcon>
                <MeetingRoomIcon />
              </ListItemIcon>
              <ListItemText primary="logout" />
            </ListItem>
          </NavLink>
        </List>
      ) : (
        <List>
          <ListItem button key="3">
            <ListItemText
              style={{ margin: "0px 45px" }}
              primary={<AddPostBtn />}
            />
          </ListItem>
          <NavLink
            style={{ textDecoration: "none", color: "#1976d2" }}
            to="/login"
          >
            <ListItem button key="1">
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={"login"} />
            </ListItem>
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "#1976d2" }}
            to="/signup"
          >
            <ListItem button key="2">
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="signup" />
            </ListItem>
          </NavLink>
        </List>
      )}
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div>
      <AppBar
        elevation={0}
        position="absolute"
        style={{ backgroundColor: "#1976d2" }}
      >
        <Container disableGutters maxWidth="xl">
          <Toolbar>
            <NavLink style={{ textDecoration: "none", color: "white" }} to="/">
              <img height="35px" src={"/images/logo3_white.png"} alt="logo" />
            </NavLink>

            {isMobile && isShown ? null : (
              <Typography variant="h6">
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginLeft: "5px",
                    whiteSpace: "nowrap",
                  }}
                  to="/"
                >
                  Pixa Verse
                </NavLink>
              </Typography>
            )}

            {isShown ? (
              <SearchBar
                history={history}
                location={location}
                window={window}
              />
            ) : null}

            <div className={classes.grow} />
            <div
              className={classes.xs_down}
              style={{
                float: "left",
                marginRight: "5px",
                marginTop: "1px",
              }}
            >
              <AddPostBtn />
            </div>
            {isMobile ? (
              <>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>

                <nav aria-label="mailbox folders">
                  <Hidden>
                    <Drawer
                      container={container}
                      variant="temporary"
                      anchor="right"
                      open={mobileOpen}
                      onClose={handleDrawerToggle}
                      ModalProps={{
                        keepMounted: true,
                      }}
                    >
                      {drawer}
                    </Drawer>
                  </Hidden>
                </nav>
              </>
            ) : (
              <div>
                {currentUser && (
                  <div>
                    <NavLink
                      style={{ textDecoration: "none", color: "white" }}
                      to={`/user-profile/${currentUser._id}`}
                    >
                      <Button color="inherit">
                        <PersonIcon />
                        hi, {userUpdated.name || currentUser.name}
                      </Button>
                    </NavLink>

                    <NavLink
                      style={{ textDecoration: "none", color: "white" }}
                      to="/logout"
                    >
                      <Button color="inherit">
                        <MeetingRoomIcon />
                        logout
                      </Button>
                    </NavLink>
                  </div>
                )}

                {!currentUser && (
                  <div>
                    <NavLink
                      style={{ textDecoration: "none", color: "white" }}
                      to="/login"
                    >
                      <Button color="inherit">
                        <ExitToAppIcon style={{ marginRight: "2px" }} />
                        login
                      </Button>
                    </NavLink>

                    <NavLink
                      style={{ textDecoration: "none", color: "white" }}
                      to="/signup"
                    >
                      <Button color="inherit">
                        <PersonAddIcon style={{ marginRight: "2px" }} />
                        sign up
                      </Button>
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default withRouter(Navbar);
