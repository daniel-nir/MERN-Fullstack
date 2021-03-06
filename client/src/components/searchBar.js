import React, { useEffect, useRef, useState } from "react";
import {
  ClickAwayListener,
  fade,
  IconButton,
  InputBase,
  makeStyles,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import clsx from "clsx";

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
    margin: "0  25px !important",
    width: "100%",

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
    zIndex: "1",
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
    borderRadius: "4px",
    transition: "all .1s ease-in-out",
    border: "solid 1px #f2f2f2",
    backgroundColor: fade(theme.palette.common.black, 0.05),
    "&:hover": { border: "solid 1px #e3e3e3" },
  },
  toggleInput: {
    border: "solid 1px #e3e3e3",
    backgroundColor: "#fff",
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: "100%",
  },
}));

const SearchBar = (props) => {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

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
  const handleClearInput = () => {
    searchInput.current.focus();
    setInput("");
  };

  const handleClick = () => {
    setIsClicked(true);
  };
  const handleClickAway = () => {
    setIsClicked(false);
  };

  console.log(isClicked);
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <form
        onClick={handleClick}
        onSubmit={handleSubmit}
        className={classes.search}
      >
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
            input: classes.inputInput,
          }}
          className={clsx(classes.inputRoot, {
            [classes.toggleInput]: isClicked === true,
          })}
          value={input}
          onChange={handleChange}
        />
      </form>
    </ClickAwayListener>
  );
};
export default SearchBar;
