import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./navbar";
import Footer from "./footer";
import Signup from "./signup";
import Login from "./login";
import Logout from "./logout";
import Home from "./home";
import CreatePost from "./createPost";
import userService from "../services/userService";
import ProtectedRoute from "./protectedRoute";
import UserProfile from "./userProfile";
import EditPost from "./editPost";
import DeletePost from "./deletePost";
import EditUser from "./editUser";
import Search from "./search";

const App = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [userUpdated, setUserUpdated] = useState({});

  useEffect(() => {
    const user = userService.getCurrentUser();
    setCurrentUser(user);
    if (!user) return;
    else
      userService.getUserProfile(user._id).then(({ data }) => {
        if (!data) {
          return;
        } else setUserUpdated(data);
      });
  }, []);

  return (
    <div>
      <header>
        <Navbar currentUser={currentUser} userUpdated={userUpdated} />
      </header>
      <main>
        <Container
          maxWidth="xl"
          disableGutters
          style={{
            minHeight: "86vh",
            marginTop: "55px",
            overflow: "hidden",
          }}
        >
          <Switch>
            <ProtectedRoute
              exact
              path="/user-profile/delete-post/:id"
              component={DeletePost}
            />
            <ProtectedRoute
              exact
              path="/user-profile/edit-post/:id"
              component={EditPost}
            />
            <ProtectedRoute
              exact
              path="/user-profile/edit"
              component={EditUser}
            />

            <ProtectedRoute exact path="/create-post" component={CreatePost} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/user-profile/:id" component={UserProfile} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Home} />
          </Switch>
        </Container>
      </main>
      <footer>
        <Footer />
      </footer>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default App;
