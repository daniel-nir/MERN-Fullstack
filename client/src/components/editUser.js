import React from "react";
import Form from "./form/form";
import PageHeader from "./pageHeader";
import Joi from "joi-browser";
import userService from "../services/userService";
import { Button } from "@material-ui/core";

class EditUser extends Form {
  state = {
    data: {
      name: "",
      email: "",
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().min(2).max(255).required().label("Name"),
    email: Joi.string().required().email().label("Email"),
  };

  mapToViewModel(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async componentDidMount() {
    const { data } = await userService.getMyProfile().then((resp) => {
      return resp;
    });

    this.setState({ data: this.mapToViewModel(data) });
  }

  async doSubmit() {
    const { data } = this.state;

    try {
      await userService.setUser(data);
      this.props.history.replace(`/user-profile/${data._id}`);
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

    window.location.reload();
  }

  handleCancel = () => {
    const { data } = this.state;
    this.props.history.replace(`/user-profile/${data._id}`);
  };

  render() {
    return (
      <div>
        <PageHeader title="user info" />

        <form
          align="center"
          style={{ marginTop: "50px" }}
          onSubmit={this.handleSubmit}
          autoComplete="off"
        >
          {this.renderInput("name", "Name")}
          {this.renderInput("email", "Email")}

          {this.renderButton("Update Profile")}
          <Button onClick={this.handleCancel}>Cancel</Button>
        </form>
      </div>
    );
  }
}

export default EditUser;
