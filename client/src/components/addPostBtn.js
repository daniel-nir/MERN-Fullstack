import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { NavLink } from "react-router-dom";
import PublishIcon from "@material-ui/icons/Publish";
const useStyles = makeStyles((theme) => ({
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[600],
    },
  },
}));

export default function AddPostBtn() {
  const classes = useStyles();
  return (
    <div>
      <NavLink style={{ textDecoration: "none" }} to="/create-post">
        <Button
          className={classes.fabGreen}
          variant="text"
          aria-label="add"
          size="medium"
        >
          <PublishIcon />
          upload
        </Button>
      </NavLink>
    </div>
  );
}
