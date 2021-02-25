import React from "react";
import Joi from "joi-browser";
import http from "../services/httpService";
import { Link, Typography } from "@material-ui/core";
import PageHeader from "./pageHeader";

import Form from "./form/form";
import { toast } from "react-toastify";

class Signup extends Form {
  state = {
    data: {
      name: "",
      password: "",
      email: "",
    },
    errors: {},
  };

  schema = {
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(6).label("Password"),
    name: Joi.string().required().min(2).label("Name"),
  };

  async doSubmit() {
    const { history } = this.props;
    const data = { ...this.state.data };

    try {
      await http.post("/api/user", data);
      toast.success("successfuly registered");
      history.replace("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.setState({
          errors: {
            ...this.state.errors,
            email: "Email is already registered",
          },
        });
      }
    }
  }

  render() {
    return (
      <div>
        <PageHeader
          title="Sign up for Pixa Place"
          sub="make an account for free"
        />

        <form
          align="center"
          style={{ marginTop: "50px" }}
          onSubmit={this.handleSubmit}
          noValidate
          autoComplete="off"
        >
          {this.renderInput("name", "Name")}
          {this.renderInput("email", "Email", "email")}
          {this.renderInput("password", "Password", "password")}

          <br></br>
          {this.renderButton("Sign Up")}
        </form>
        <br></br>

        <Typography align="center">
          Already have an account?
          <Link href="/login">
            {" "}
            Log in here <b>&rarr;</b>
          </Link>
        </Typography>
      </div>
    );
  }
}

export default Signup;
