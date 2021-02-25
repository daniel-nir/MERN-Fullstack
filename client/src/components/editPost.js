import React, { useState, useEffect } from "react";
import { Form, Formik, FieldArray, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Link } from "react-router-dom";

import PageHeader from "./pageHeader";
import postService from "../services/postService";
import { toast } from "react-toastify";
import userService from "../services/userService";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EditPost = (props) => {
  const [formValues, setFormValues] = useState({
    postTags: [],
    postText: "",
    postImage: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const validationSchema = Yup.object().shape({
    _id: Yup.string(),
    postText: Yup.string()
      .min(2, "must be at least 2 characters")
      .max(255)
      .required("this field is required"),

    postTags: Yup.array().of(Yup.string().required("post tag cannot be empty")),
  });

  function mapToViewModel(post) {
    return {
      _id: post._id,
      postTags: post.postTags,
      postText: post.postText,
      postImage: post.postImage,
    };
  }

  useEffect(() => {
    const postId = props.match.params.id;

    postService.getPost(postId).then(({ data }) => {
      if (!data) return;
      else {
        setFormValues(mapToViewModel(data));
      }
    });

    userService.getMyProfile().then(({ data }) => {
      setCurrentUser(data);
    });
  }, [props.match.params.id]);

  const handleCancel = () => {
    props.history.replace(`/user-profile/${currentUser._id}`);
  };

  const handleSubmit = async (values) => {
    await postService.setPost(values);
    toast("post updated");
    props.history.replace(`/user-profile/${currentUser._id}`);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClickClose = () => {
    setOpenDialog(false);
  };

  console.log(formValues);
  return (
    <div style={{ padding: "20px" }}>
      {formValues && (
        <Formik
          enableReinitialize
          initialValues={formValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({
            dirty,
            isValid,
            values,
            errors,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <div>
              <PageHeader title="edit post" />
              <Grid container justify="center">
                <Form
                  encType="multipart/form-data"
                  align="center"
                  style={{ marginTop: "50px" }}
                  autoComplete="off"
                >
                  <Grid item>
                    <TextField
                      fullWidth
                      htmlFor="postText"
                      variant="outlined"
                      id="postText"
                      label="post text"
                      type="text"
                      value={values.postText}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={errors.postText}
                      error={Boolean(errors.postText)}
                    />
                  </Grid>

                  <br />
                  <Box
                    style={{
                      maxWidth: "340px",
                      marginBottom: "20px",
                    }}
                  >
                    {formValues.postImage ? (
                      <CardMedia
                        style={{ borderRadius: "5px" }}
                        component="img"
                        height="230px"
                        src={`http://localhost:3900/${formValues.postImage}`}
                        alt={"image preview"}
                      />
                    ) : null}
                  </Box>

                  <br />
                  <Grid item>
                    <FieldArray
                      name="postTags"
                      render={(arrayHelpers) => (
                        <div>
                          <Button
                            variant="outlined"
                            type="button"
                            onClick={() => arrayHelpers.push("")}
                          >
                            add tag
                          </Button>
                          {values.postTags.map((postTag, index) => {
                            return (
                              <div key={index}>
                                <Field
                                  as={TextField}
                                  placeholder="post tag"
                                  onChange={handleChange}
                                  name={`postTags.${index}`}
                                  error={Boolean(errors.postTags)}
                                />
                                <Button
                                  type="button"
                                  variant="text"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  X
                                </Button>

                                {errors.postTags ? (
                                  <div style={{ marginRight: "65px" }}>
                                    <Typography variant="caption" color="error">
                                      {errors.postTags[index]}
                                    </Typography>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                          <br />
                        </div>
                      )}
                    />
                  </Grid>
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!dirty || !isValid || isSubmitting}
                  >
                    Update
                  </Button>
                  <Button onClick={handleCancel}>cancel</Button>
                </Form>
              </Grid>
              <Button
                onClick={handleClickOpen}
                style={{ marginTop: "80px", textAlign: "left" }}
                color="secondary"
                variant="outlined"
              >
                <Typography variant="body2" color="error">
                  <DeleteForeverIcon style={{ marginBottom: "-7px" }} />
                  delete
                </Typography>
              </Button>
            </div>
          )}
        </Formik>
      )}
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
            to={`/my-profile/delete-post/${formValues._id}`}
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

export default EditPost;
