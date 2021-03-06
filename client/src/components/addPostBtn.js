import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import PublishIcon from "@material-ui/icons/Publish";
const useStyles = makeStyles((theme) => ({
  customBtn: {
    color: theme.palette.common.white,
    backgroundColor: green["A700"],
    "&:hover": {
      backgroundColor: "#47b800",
    },
  },
}));

export default function AddPostBtn() {
  const classes = useStyles();
  return (
    <div>
      <Button className={classes.customBtn} variant="text" aria-label="add">
        <PublishIcon />
        upload
      </Button>
    </div>
  );
}
