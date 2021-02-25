import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ name, label, error, err, ...rest }) {
  const classes = useStyles();
  if (error) {
    err = true;
  }
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className={classes.root}>
          <TextField
            fullWidth
            className="secondary"
            htmlFor={name}
            name={name}
            id={name}
            label={label}
            variant="outlined"
            {...rest}
            helperText={error}
            error={err}
          />
        </div>
      </Grid>
    </Grid>
  );
}
