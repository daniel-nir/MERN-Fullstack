import React, { useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import { NavLink } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { withRouter } from "react-router-dom";
import AddPostBtn from "./addPostBtn";
import ClearIcon from "@material-ui/icons/Clear";
import {
  Container,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import SearchBar from "./search/searchBar";

const useStyles = makeStyles((theme) => ({
  paper: {
    background: "#fff",
  },

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
  clearDrawer: {
    color: "#444",
    position: "absolute",
    backgroundColor: "transparent",
    right: "10px",
    top: "0px",
    "&:hover": {
      color: "#000",
    },
  },

  navl: {
    color: "#555",
    textDecoration: "none",
    transition: ".2s",
    "&:hover": {
      color: "#000",
    },
    "&:selected": {
      color: "#000",
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
      setIsShown(
        location.pathname !== "/" &&
          location.pathname !== "/signup" &&
          location.pathname !== "/login"
      );
    }

    return () => setIsMounted(false);
  }, [isMounted, location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div
      className={classes.paper}
      style={{
        width: 240,
        height: "100vh",
        textTransform: "capitalize",
      }}
      onClick={() => setMobileOpen(false)}
    >
      <div>
        <List>
          <ListItem style={{ padding: "0" }} key="1">
            <IconButton
              style={{ backgroundColor: "transparent" }}
              className={classes.clearDrawer}
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <ClearIcon />
            </IconButton>
          </ListItem>
          <NavLink style={{ textDecoration: "none" }} to={`/create-post`}>
            <ListItem
              key="2"
              button
              style={{ padding: "2px 0 2px 40px", marginTop: "50px" }}
            >
              <ListItemText primary={<AddPostBtn />} />
            </ListItem>
          </NavLink>
          <NavLink style={{ textDecoration: "none", color: "#000" }} to={`/`}>
            <ListItem button key="3">
              <ListItemIcon style={{ color: "#000" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="home" />
            </ListItem>
          </NavLink>
          {currentUser ? (
            <>
              <NavLink
                style={{ textDecoration: "none", color: "#000" }}
                to={`/users/${currentUser._id}`}
              >
                <ListItem button key="4">
                  <ListItemIcon style={{ color: "#000" }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={`${currentUser.name}`} />
                </ListItem>
              </NavLink>
              <NavLink
                style={{ textDecoration: "none", color: "#000" }}
                to="/logout"
              >
                <ListItem button key="5">
                  <ListItemIcon style={{ color: "#000" }}>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                style={{ textDecoration: "none", color: "#000" }}
                to="/login"
              >
                <ListItem button key="4">
                  <ListItemIcon style={{ color: "#000" }}>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary={"login"} />
                </ListItem>
              </NavLink>
              <NavLink
                style={{ textDecoration: "none", color: "#000" }}
                to="/signup"
              >
                <ListItem button key="5">
                  <ListItemIcon style={{ color: "#000" }}>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="signup" />
                </ListItem>
              </NavLink>
            </>
          )}
        </List>
      </div>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div>
      <AppBar
        elevation={0}
        position="absolute"
        style={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Container disableGutters maxWidth="xl">
          <Toolbar>
            <Typography variant="h5">
              <NavLink
                style={{
                  textDecoration: "none",
                  color: "#000",
                }}
                to="/"
              >
                <img
                  height="30px"
                  style={{ marginTop: "10px" }}
                  src="/images/logo2.svg"
                  alt="pixaplace logo"
                />
              </NavLink>
            </Typography>

            {isShown ? (
              <SearchBar
                history={history}
                location={location}
                window={window}
              />
            ) : (
              <div className={classes.grow}></div>
            )}

            <NavLink
              to="/create-post"
              className={classes.xs_down}
              style={{
                marginRight: "20px",
                textDecoration: "none",
              }}
            >
              <AddPostBtn />
            </NavLink>
            {isMobile ? (
              <>
                <IconButton
                  size="small"
                  edge="end"
                  style={{
                    color: "#000",
                    backgroundColor: "transparent",
                  }}
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
                  <div style={{ whiteSpace: "nowrap" }}>
                    <NavLink
                      style={{ textDecoration: "none" }}
                      to={`/users/${currentUser._id}`}
                    >
                      <Button
                        className={classes.navl}
                        variant="text"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <PersonIcon />
                        {userUpdated.name || currentUser.name}
                      </Button>
                    </NavLink>

                    <NavLink
                      style={{
                        marginLeft: "20px",
                        textDecoration: "none",
                      }}
                      to="/logout"
                    >
                      <Button
                        style={{ backgroundColor: "transparent" }}
                        className={classes.navl}
                      >
                        <ExitToAppIcon />
                        logout
                      </Button>
                    </NavLink>
                  </div>
                )}

                {!currentUser && (
                  <div style={{ whiteSpace: "nowrap" }}>
                    <NavLink
                      style={{
                        textDecoration: "none",
                        color: "#000",
                        marginRight: "20px",
                      }}
                      to="/login"
                    >
                      <Button color="inherit">
                        <ExitToAppIcon />
                        login
                      </Button>
                    </NavLink>

                    <NavLink
                      style={{ textDecoration: "none", color: "#000" }}
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
