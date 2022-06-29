const express = require("express");
const User = require("../models/user");
const router = express.Router();

const getUser = async (userId) => {
   let user;
   try {
      user = await User.findById(userId);
      if (!user) {
         return res
            .status(404)
            .json({ message: `Cannot find user '${userId}'` });
      }
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
   return user;
};

// Getting all
const getAllUsers = async (req, res) => {
   try {
      const Users = await User.find();
      res.json(Users);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Getting one
const getAUser = async (req, res) => {
   res.json(getUser(req.params.id));
};

// Creating one
const AddAUser = async (req, res) => {
   const user = new User({
      email: req.body.email,
      password: req.body.password,
   });
   try {
      const newUser = await user.save();
      res.status(201).json(newUser);
   } catch (error) {
      console.log("ERROR: ", error);
      res.status(400).json({ message: error.message });
   }
};

// Deleting one
const deleteAUser = async (req, res) => {
   try {
      let user = getUser(req.params.id);
      await res.user.remove();
      res.json({
         message: `User ('${user.id}', '${user.name}', '${user.email}') deleted`,
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

module.exports = {
   getAllUsers,
   getAUser,
   AddAUser,
   deleteAUser,
};
