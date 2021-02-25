import React, { useRef, useState, useEffect } from "react";
import { Form, Formik, FieldArray, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  Paper,
  TextField,
  Typography,
  Zoom,
} from "@material-ui/core";

import PageHeader from "./pageHeader";
import postService from "../services/postService";

const CreatePost = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const filePickerRef = useRef();
  const FILE_SIZE = 1920 * 1282;

  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
  ];

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const validationSchema = Yup.object().shape({
    postText: Yup.string()
      .min(2, "must be at least 2 characters")
      .max(255)
      .required("this field is required"),
    postImage: Yup.mixed()
      .required("an image is required")
      .test(
        "fileFormat",
        "oops, wrong file",
        (value) => value && SUPPORTED_FORMATS.includes(value.type)
      )
      .test(
        "fileSize",
        "image size too large",
        (value) => value && value.size <= FILE_SIZE
      ),
    postTags: Yup.array().of(Yup.string().required("post tag cannot be empty")),
  });

  const pickedHandler = (event) => {
    let pickedFile;
    pickedFile = event.target.files[0];
    setFile(pickedFile);
  };

  const handleSubmit = async (values) => {
    try {
      const data = new FormData();
      data.append("postImage", values.postImage);

      values.postTags.forEach((postTag) => {
        data.append("postTags[]", postTag);
      });

      data.append("postText", values.postText);
      console.log(values);

      await postService.createPost(data);

      props.history.replace("/");
    } catch (err) {}
  };
  return (
    <div>
      <Formik
        initialValues={{ postImage: "", postTags: [], postText: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({
          dirty,
          isValid,
          values,
          errors,
          handleChange,
          setFieldValue,
          handleBlur,
          isSubmitting,
        }) => (
          <div>
            <PageHeader title="create a new post" />
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
                    name="postText"
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
                <div>
                  {previewUrl && (
                    <Zoom in={true}>
                      <Box
                        style={{
                          maxWidth: "340px",
                          marginBottom: "20px",
                        }}
                      >
                        <CardMedia
                          style={{ borderRadius: "5px" }}
                          component="img"
                          height="230px"
                          image={previewUrl}
                          alt="Preview"
                        />
                      </Box>
                    </Zoom>
                  )}
                  {!previewUrl && (
                    <Paper
                      variant="outlined"
                      style={{
                        maxWidth: "340px",
                        marginBottom: "20px",
                        height: "230px",
                      }}
                    >
                      <Typography
                        color="textSecondary"
                        style={{ padding: "95px" }}
                      >
                        *please pick an image
                      </Typography>
                    </Paper>
                  )}
                </div>

                <Grid item>
                  <TextField
                    fullWidth
                    htmlFor="postImage"
                    variant="outlined"
                    id="postImage"
                    type="file"
                    ref={filePickerRef}
                    values={values.postImage}
                    onInput={pickedHandler}
                    onChange={(event) =>
                      setFieldValue("postImage", event.target.files[0])
                    }
                    helperText={errors.postImage}
                    error={Boolean(errors.postImage)}
                  />
                </Grid>
                <br />
                <Grid item>
                  <FieldArray name="postTags">
                    {({ push, remove }) => (
                      <div>
                        <Button
                          variant="outlined"
                          type="button"
                          onClick={() => push("")}
                        >
                          add tag
                        </Button>
                        {values.postTags.map((postTag, index) => {
                          const postTags = `postTags.${index}`;
                          return (
                            <div key={index}>
                              <Field
                                as={TextField}
                                placeholder="post tag"
                                name={postTags}
                                error={Boolean(errors.postTags)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                              />
                              <Button
                                type="button"
                                variant="text"
                                onClick={() => remove(index)}
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
                        {/* <pre style={{ textAlign: "left" }}>
                          <strong>Values</strong>
                          <br />
                          {JSON.stringify(values, null, 2)}
                        </pre>
                        <pre style={{ textAlign: "left" }}>
                          <strong>Errors</strong>
                          <br />
                          {JSON.stringify(errors, null, 2)}
                        </pre> */}
                      </div>
                    )}
                  </FieldArray>
                </Grid>
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  Submit
                </Button>
              </Form>
            </Grid>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default CreatePost;
