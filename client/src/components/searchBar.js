import React, { useEffect, useRef, useState } from "react";
import { fade, IconButton, InputBase, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  xs_down: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  xs_up: {
    [theme.breakpoints.up("xs")]: {
      display: "none",
    },
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    color: "#555",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.05),
    margin: "0  25px !important",
    width: "100%",
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.07),
    },
    [theme.breakpoints.down("xs")]: {
      margin: "0 15px !important",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#999",
  },
  clearIcon: {
    padding: theme.spacing(0, 2),
    right: "0",
    height: "100%",
    position: "absolute",
    display: "flex",
    zIndex: "1",
    "&:hover": {
      color: "#000",
    },
  },
  inputRoot: {
    color: "#000",
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),

    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const SearchBar = (props) => {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const searchInput = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
      const params = new URLSearchParams(props.location.search);
      const q = params.get("q");
      setInput(q ? q : "");
    }
    return () => setIsMounted(false);
  }, [isMounted, props.location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    props.history.push(`/search?q=${input}`);
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };
  function handleClearInput() {
    setInput("");
    searchInput.current.focus();
  }

  return (
    <form onSubmit={handleSubmit} className={classes.search}>
      {input && (
        <IconButton
          className={classes.clearIcon}
          style={{ backgroundColor: "transparent" }}
          size="small"
          onClick={handleClearInput}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      )}

      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        inputRef={searchInput}
        type="text"
        placeholder="Search photos…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        value={input}
        onChange={handleChange}
      />
    </form>
  );
};
export default SearchBar;
