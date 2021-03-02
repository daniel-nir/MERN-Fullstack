import React from "react";
import Joi from "joi-browser";
import userService from "../services/userService";
import { Link, Typography } from "@material-ui/core";

import Form from "./form/form";
import PageHeader from "./pageHeader";

class Login extends Form {
  state = {
    data: {
      password: "",
      email: "",
    },
    errors: {},
  };

  schema = {
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(6).label("Password"),
  };

  async doSubmit() {
    const { email, password } = this.state.data;
    const { state } = this.props.location;

    try {
      await userService.login(email, password);

      if (state && state.from) {
        return (window.location = state.from.pathname);
      }

      window.location = "/";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.setState({ errors: { email: error.response.data } });
      }
    }
  }

  render() {
    return (
      <div>
        <PageHeader title="Login" sub="hop on and join the party" />
        <form
          align="center"
          style={{ marginTop: "50px" }}
          onSubmit={this.handleSubmit}
          noValidate
          autoComplete="on"
        >
          {this.renderInput("email", "Email", "email")}
          {this.renderInput("password", "Password", "password")}
          <br></br>
          {this.renderButton("login")}
        </form>
        <Typography align="center">
          <br></br>
          Don't have an account?
          <Link href="/signup">
            {" "}
            sign up here <b>&rarr;</b>
          </Link>
        </Typography>
      </div>
    );
  }
}

export default Login;
