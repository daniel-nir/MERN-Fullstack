import React from "react";
import { useTheme } from "@material-ui/core/styles";
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
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

const Navbar = ({ currentUser, userUpdated, window }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div style={{ width: 240 }} onClick={() => setMobileOpen(false)}>
      {currentUser ? (
        <List>
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
        position="fixed"
        style={{ backgroundColor: "#1976d2" }}
      >
        <Toolbar>
          <NavLink style={{ textDecoration: "none", color: "white" }} to="/">
            <img height="35px" src={"/images/logo3_white.png"} alt="logo" />
          </NavLink>
          <Typography variant="h6">
            <NavLink
              style={{
                textDecoration: "none",
                color: "white",
                marginLeft: "5px",
              }}
              to="/"
            >
              PIXA UNIVERSE
            </NavLink>
          </Typography>
          {isMobile ? null : (
            <>
              <div style={{ flexGrow: "1" }} />
            </>
          )}

          {isMobile ? (
            <>
              <div style={{ flexGrow: "1" }} />
              <div style={{ marginRight: "5px" }}>
                <AddPostBtn />
              </div>
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
                  <div
                    style={{
                      float: "left",
                      marginRight: "5px",
                      marginTop: "1px",
                    }}
                  >
                    <AddPostBtn />
                  </div>
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
                  <div
                    style={{
                      float: "left",
                      marginRight: "5px",
                      marginTop: "1px",
                    }}
                  >
                    <AddPostBtn />
                  </div>

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
      </AppBar>
    </div>
  );
};

export default withRouter(Navbar);
