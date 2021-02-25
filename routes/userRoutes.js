const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate, validatePosts } = require("../models/user");
const { Post } = require("../models/post");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/:id/user", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  res.send(user);
});

router.get("/users", async (req, res) => {
  const users = await User.find({}).select("name");
  res.send(users);
});

router.get("/:id/my-profile", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  res.send(user);
});
router.get("/:id/user-profile", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  res.send(user);
});

router.put("/:id/add-to-favorites", auth, async (req, res) => {
  let user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { favorites: req.params.id } }
  );

  user = await User.findOne({ _id: req.user._id }).select("-password");
  res.send(user);
});

router.put("/:id/remove-from-favorites", auth, async (req, res) => {
  let user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { favorites: req.params.id } }
  );

  user = await User.findOne({ _id: req.user._id }).select("-password");
  res.send(user);
});

router.put("/update-user", auth, async (req, res) => {
  let user = await User.findOneAndUpdate({ _id: req.user._id }, req.body);
  user = await User.findOne({ _id: req.user._id }).select("-password");
  res.send(user);
});

const getFavorites = async (favorites) => {
  const posts = await Post.find({ _id: { $in: favorites } }).sort({ _id: -1 });
  return posts;
};

router.get("/:id/favorites", auth, async (req, res) => {
  const posts = await getFavorites(req.params.id.split(","));
  res.send(posts);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
