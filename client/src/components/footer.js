import React from "react";
import Divider from "@material-ui/core/Divider";
import { Box, Typography } from "@material-ui/core";

const Footer = () => {
  return (
    <div
      style={{
        position: "relative",
        bottom: "0",
        textAlign: "center",
        width: "100%",
      }}
    >
      <Divider variant="middle" />
      <Box p={3}>
        <Typography>Pixa Place &copy; {new Date().getFullYear()}</Typography>
      </Box>
    </div>
  );
};
export default Footer;
