import React from "react";
import { makeStyles } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import Fab from "@material-ui/core/Fab";
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
        <Fab
          className={classes.fabGreen}
          variant="extended"
          aria-label="add"
          size="small"
        >
          <PublishIcon />
          upload
        </Fab>
      </NavLink>
    </div>
  );
}
