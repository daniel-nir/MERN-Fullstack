const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },

  profile_image: {
    type: String,
    minlength: 8,
    maxlength: 1024,
  },

  favorites: [],

  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      favorites: this.favorites,
      createdAt: this.createdAt,
    },
    keys.jwtKey
  );
  return token;
};

const User = mongoose.model("User", userSchema);
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
}

function validatePosts(data) {
  const schema = Joi.object({
    posts: Joi.array().min(1).required(),
  });

  return schema.validate(data);
}

exports.User = User;
exports.validate = validateUser;
exports.validatePosts = validatePosts;
