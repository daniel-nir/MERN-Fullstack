import React, { useEffect, useState } from "react";
import Posts from "../post/posts";
import postService from "../../services/postService";
import userService from "../../services/userService";
import Loader from "react-loader-spinner";
import { Box, Container, Divider, Grid, Typography } from "@material-ui/core";

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
    <Container maxWidth="xl" disableGutters>
      {isLoading ? (
        <Loader
          style={{ textAlign: "center" }}
          type="TailSpin"
          color="#00BFFF"
          height={400}
          width={50}
          timeout={1500}
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
                  <Container maxWidth="xl" style={{ margin: "5px 0 10px 0" }}>
                    <Typography variant="body2">0 Photos</Typography>
                  </Container>

                  <Divider />

                  <Container maxWidth="lg" style={{ marginTop: "20px" }}>
                    <Typography
                      variant="h3"
                      component="h2"
                      style={{
                        margin: "40px 0",
                        color: "#000",
                        textTransform: "capitalize",
                      }}
                    >
                      {searchTerm}
                    </Typography>
                    <Typography
                      style={{
                        color: "grey",
                      }}
                    >
                      <b>Sorry, we couldn't find any matches.</b>
                      <br />
                      things you can try:
                    </Typography>
                    <ul style={{ color: "grey", marginLeft: "-24px" }}>
                      <li>
                        <Typography>Check the spelling.</Typography>
                      </li>
                      <li>
                        <Typography>Use synonyms or generic terms.</Typography>
                      </li>
                    </ul>
                    <Grid container>
                      <Box m="auto">
                        <img
                          style={{ opacity: 0.4, marginTop: "20%" }}
                          height="200"
                          src="/images/sad_face_noresources.png"
                          alt="sad face"
                        />
                      </Box>
                    </Grid>
                  </Container>
                </>
              ) : (
                <>
                  <Container maxWidth="xl" style={{ margin: "5px 0 10px 0" }}>
                    <Typography variant="body2">
                      {filtered.length} Photos
                    </Typography>
                  </Container>
                  <Divider />
                  <Container maxWidth="lg" style={{ marginTop: "20px" }}>
                    <Typography
                      variant="h3"
                      component="h2"
                      style={{ margin: "40px 0", textTransform: "capitalize" }}
                    >
                      {searchTerm}
                    </Typography>
                    <Posts currentUser={currentUser} posts={filtered} />
                  </Container>
                </>
              )}
            </>
          ) : (
            <>
              <Container maxWidth="xl" style={{ margin: "5px 0 10px 0" }}>
                <Typography variant="body2">
                  {allPosts.length} Photos
                </Typography>
              </Container>

              <Divider />

              <Container maxWidth="lg" style={{ marginTop: "20px" }}>
                <Posts currentUser={currentUser} posts={allPosts} />
              </Container>
            </>
          )}
        </div>
      )}
    </Container>
  );
};

export default Search;
