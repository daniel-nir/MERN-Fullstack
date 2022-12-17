import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "jquery/dist/jquery";
import App from "./components/App";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { disableReactDevtools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === "production") disableReactDevtools();

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
