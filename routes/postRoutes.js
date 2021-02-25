const express = require("express");
const _ = require("lodash");
const { Post, validatePost, generatePostNumber } = require("../models/post");
const auth = require("../middleware/auth");
const fileUpload = require("../middleware/fileUpload");
const router = express.Router();

router.get("/posts", async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.send(posts);
});

router.get("/my-posts", auth, async (req, res) => {
  if (!req.user) return res.status(401).send("Access denied.");
  const posts = await Post.find({ _user: req.user._id }).sort({
    createdAt: -1,
  });
  res.send(posts);
});

//get user posts by id -> service: getUserPosts
router.get("/:id/user-posts", async (req, res) => {
  const posts = await Post.find({ _user: req.params.id });
  res.send(posts);
});

router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findOneAndRemove({
    _id: req.params.id,
    _user: req.user._id,
  });
  if (!post)
    return res.status(404).send("The post with the given ID was not found.");
  res.send(post);
});

router.put("/:id/update-post", auth, async (req, res) => {
  let post = await Post.findOneAndUpdate(
    { _id: req.params.id, _user: req.user._id },
    req.body
  );
  if (!post)
    return res.status(404).send("The post with the given ID was not found.");

  post = await Post.findOne({ _id: req.params.id, _user: req.user._id });
  res.send(post);
});

router.put("/:id/like", auth, async (req, res) => {
  let post = await Post.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { postLikes: req.user._id } }
  );

  post = await Post.findOne({ _id: req.params.id });
  res.send(post);
});

router.put("/:id/unlike", auth, async (req, res) => {
  let post = await Post.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { postLikes: req.user._id } }
  );

  post = await Post.findOne({ _id: req.params.id });
  res.send(post);
});

router.get("/:id/my-post", auth, async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    _user: req.user._id,
  });
  if (!post)
    return res.status(404).send("The post with the given ID was not found.");
  res.send(post);
});
router.get("/:id/post", async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
  });
  if (!post)
    return res.status(404).send("The post with the given ID was not found.");
  res.send(post);
});

router.post("/", fileUpload.single("postImage"), auth, async (req, res) => {
  console.log(req.file);
  const { error } = validatePost(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let post = new Post({
    postText: req.body.postText,
    postImage: req.file.path.replace("\\", "/"),
    postTags: req.body.postTags,
    postLikes: req.body.postLikes,
    postNumber: await generatePostNumber(Post),
    _user: req.user._id,
  });

  post = await post.save();
  res.send(post);
});

module.exports = router;
