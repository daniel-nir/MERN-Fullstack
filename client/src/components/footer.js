import React from "react";
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
      <Box p={3}>
        <Typography variant="body2">
          pixaplace &copy; {new Date().getFullYear()}
        </Typography>
      </Box>
    </div>
  );
};
export default Footer;
