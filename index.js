const user = require("./routes/userRoutes");
const auth = require("./routes/authRoutes");
const post = require("./routes/postRoutes");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cors = require("cors");

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log(" listening on port 3900..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(cors());
app.use(bodyParser.json());

app.use(require("morgan")("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/posts", post);
app.use("/uploads", express.static("uploads"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  //Express will serve up the index.html file if
  //it doesnt recognize the route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || "https://whimsical-heliotrope-ac72e9.netlify.app";
app.listen(PORT);
