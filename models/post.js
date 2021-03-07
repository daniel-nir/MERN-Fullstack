const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const postSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  tags: Array,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  postNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 99999999999,
    unique: true,
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    image: Joi.string().required,
    tags: Joi.array().items(Joi.string()),
  });
  return schema.validate(post);
}

async function generatePostNumber(Post) {
  while (true) {
    let randomNumber = _.random(1000, 999999999);
    let post = await Post.findOne({ postNumber: randomNumber });
    if (!post) return String(randomNumber);
  }
}

exports.Post = Post;
exports.validatePost = validatePost;
exports.generatePostNumber = generatePostNumber;
