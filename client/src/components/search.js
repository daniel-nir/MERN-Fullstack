import React, { useEffect, useState } from "react";
import Posts from "./posts";
import postService from "../services/postService";
import userService from "../services/userService";
import Loader from "react-loader-spinner";
import { Container, Typography } from "@material-ui/core";

const Search = (props) => {
  const [allPosts, setAllPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
      const data = userService.getCurrentUser();
      if (data) {
        setCurrentUser(data);
      }

      const params = new URLSearchParams(props.location.search);
      const q = params.get("q");
      setSearchTerm(q ? q : "");
      if (q) {
        postService.getSearched(q).then(({ data }) => {
          if (data) {
            setFiltered(data);
            setIsLoading(false);
          }
        });
      }

      postService.getAllPosts().then(({ data }) => {
        setAllPosts(data);
        setIsLoading(false);
      });
    }
    return () => setIsMounted(false);
  }, [isMounted, props.location.search, searchTerm]);

  return (
    <Container disableGutters maxWidth="xl">
      {isLoading ? (
        <Loader
          style={{ textAlign: "center" }}
          type="TailSpin"
          color="#00BFFF"
          height={400}
          width={50}
          timeout={1000}
        />
      ) : (
        <div
          style={{
            padding: "10px 0px",
          }}
        >
          {searchTerm ? (
            <>
              {filtered.length === 0 ? (
                <>
                  <Typography
                    style={{
                      color: "grey",
                      margin: "35px 25px 0px 25px",
                    }}
                  >
                    <b>Sorry, we couldn't find any matches.</b>
                    <br />
                    things you can try:
                  </Typography>
                  <ul style={{ color: "grey" }}>
                    <li>
                      <Typography>Check the spelling.</Typography>
                    </li>
                    <li>
                      <Typography>Use synonyms or generic terms.</Typography>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    style={{
                      color: "grey",
                      margin: "35px 25px",
                    }}
                  >
                    {filtered.length} images of {searchTerm}
                  </Typography>
                  <Posts currentUser={currentUser} posts={filtered} />
                </>
              )}
            </>
          ) : (
            <>
              <Typography
                variant="body2"
                style={{
                  color: "grey",
                  margin: "35px 25px",
                }}
              >
                {allPosts.length}
              </Typography>
              <Posts currentUser={currentUser} posts={allPosts} />
            </>
          )}
        </div>
      )}
    </Container>
  );
};

export default Search;
