import React, { useState /* useEffect */ } from "react";
import { InputBase, makeStyles, Paper } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "30px",
    padding: "2px 4px",
    display: "flex",
    margin: "auto",
    alignItems: "center",
    maxWidth: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const SearchInput = (props) => {
  const classes = useStyles();
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.history.replace(`/search?q=${input}`);
  };
  return (
    <Paper onSubmit={handleSubmit} component="form" className={classes.root}>
      <InputBase
        type="text"
        className={classes.input}
        placeholder="Search images by tags"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <IconButton
        type="submit"
        onSubmit={handleSubmit}
        className={classes.iconButton}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
export default SearchInput;
