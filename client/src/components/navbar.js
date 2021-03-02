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
      {currentUser ? (
        <div>
          <List>
            <ListItem style={{ padding: "0" }} button key="4">
              <ListItemText
                style={{ margin: "0px 40px" }}
                primary={<AddPostBtn />}
              />
              <IconButton
                style={{
                  color: "#000",
                  marginRight: "20px",
                  backgroundColor: "transparent",
                }}
                aria-label="menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </ListItem>

            <NavLink style={{ textDecoration: "none", color: "#000" }} to={`/`}>
              <ListItem button key="5">
                <ListItemIcon style={{ color: "#000" }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="home" />
              </ListItem>
            </NavLink>

            <NavLink
              style={{ textDecoration: "none", color: "#000" }}
              to={`/user-profile/${currentUser._id}`}
            >
              <ListItem button key="1">
                <ListItemIcon style={{ color: "#000" }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={`Hi, ${currentUser.name}`} />
              </ListItem>
            </NavLink>
            <NavLink
              style={{ textDecoration: "none", color: "#000" }}
              to="/logout"
            >
              <ListItem button key="2">
                <ListItemIcon style={{ color: "#000" }}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </NavLink>
          </List>
        </div>
      ) : (
        <div>
          <List>
            <ListItem style={{ padding: "0" }} button key="4">
              <ListItemText
                style={{ margin: "0px 40px" }}
                primary={<AddPostBtn />}
              />
              <IconButton
                style={{
                  color: "#000",
                  marginRight: "20px",
                  backgroundColor: "transparent",
                }}
                aria-label="menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </ListItem>

            <NavLink
              style={{ textDecoration: "none", color: "#000" }}
              to="/login"
            >
              <ListItem button key="1">
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
              <ListItem button key="2">
                <ListItemIcon style={{ color: "#000" }}>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="signup" />
              </ListItem>
            </NavLink>
          </List>
        </div>
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
        style={{ backgroundColor: "#fff" }}
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
                pixaplace
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

            <div
              className={classes.xs_down}
              style={{
                float: "left",
                marginRight: "5px",
              }}
            >
              <AddPostBtn />
            </div>
            {isMobile ? (
              <>
                <IconButton
                  edge="end"
                  style={{ color: "#000", backgroundColor: "transparent" }}
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
                      style={{
                        textDecoration: "none",
                        color: "#000",
                      }}
                      to={`/user-profile/${currentUser._id}`}
                    >
                      <Button variant="text" color="inherit">
                        <PersonIcon />
                        hi, {userUpdated.name || currentUser.name}
                      </Button>
                    </NavLink>

                    <NavLink
                      style={{ textDecoration: "none", color: "#000" }}
                      to="/logout"
                    >
                      <Button
                        color="inherit"
                        style={{ textDecoration: "lowercase" }}
                      >
                        <ExitToAppIcon style={{ marginRight: "2px" }} />
                        logout
                      </Button>
                    </NavLink>
                  </div>
                )}

                {!currentUser && (
                  <div style={{ whiteSpace: "nowrap" }}>
                    <NavLink
                      style={{ textDecoration: "none", color: "#000" }}
                      to="/login"
                    >
                      <Button color="inherit">
                        <ExitToAppIcon style={{ marginRight: "2px" }} />
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
