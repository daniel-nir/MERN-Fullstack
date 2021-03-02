import React from "react";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";

const PageTitle = ({ title, sub }) => {
  return (
    <Grid style={{ marginTop: "100px" }} align="center" container spacing={1}>
      <Grid item xs={12}>
        <Typography style={{ fontSize: "40px" }} variant="h3">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography style={{ fontSize: "25px" }} variant="h3">
          {sub}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default PageTitle;
