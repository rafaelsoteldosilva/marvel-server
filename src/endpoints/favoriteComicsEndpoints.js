const express = require("express");
const router = express.Router();
const FavoriteComic = require("../models/favoriteComic");

// Getting all users favorite comics
const getAllUsersFavoriteComics = async (req, res) => {
   let userId = req.query.userId;
   try {
      const favoriteComics = await FavoriteComic.find({ userId });
      favoriteComics
         ? res.status(200).json(favoriteComics)
         : res.status(404).json({ message: "No favorite comics found" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Adding one
const addAUsersFavoriteComic = async (req, res) => {
   const favoriteComic = new FavoriteComic({
      userId: req.query.userId,
      comicId: req.body.comicId,
      comicTitle: req.body.comicTitle,
      comicPrice: req.body.comicPrice,
      comicImageUrl: req.body.comicImageUrl,
      comicText: req.body.comicText,
   });
   try {
      const newFavoriteComic = await favoriteComic.save();

      res.status(201).json(newFavoriteComic);
   } catch (error) {
      res.status(400).json({
         message: `cannot create favorite comic for ${req.query.userId}, ${error.message}`,
      });
   }
};

// Deleting one
const deleteAUsersFavoriteComic = async (req, res) => {
   let userId = req.query.userId;
   let comicId = req.query.favoriteComicId;
   // This code didn't work
   // let theQuery = {
   //    $and: [
   //       { userId: { $eq: req.query.userId } },
   //       { comicId: { $eq: req.query.favoriteComicId } },
   //    ],
   // };
   try {
      // This code didn't work either
      // let favoriteComic = await FavoriteComic.find({
      //    userId
      //    comicId,
      // });
      // // await favoriteComic.remove({ theQuery });
      // res.json({
      //    message: `Favorite Comic  ('${userId}', '${comicId}') deleted`,
      // });
      const favoriteComics = await FavoriteComic.find({ userId });
      // Search in the resulting array for the comic with the comicId === req.query.favoriteComicId
      let comicToDelete = favoriteComics.find(
         (favoriteComic) => comicId === req.query.favoriteComicId
      );
      // Delete this record
      comicToDelete.remove();
      res.json({
         message: `Favorite Comic  ('${userId}', '${comicId}') deleted`,
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Deleting all
const deleteAllUsersFavoriteComics = async (req, res) => {
   let userId = req.query.userId;

   try {
      await FavoriteComic.remove({
         userId: `${userId}`,
      });
      res.json({
         message: `Favorite Comics for  ('${userId}') deleted`,
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

module.exports = {
   getAllUsersFavoriteComics,
   addAUsersFavoriteComic,
   deleteAUsersFavoriteComic,
   deleteAllUsersFavoriteComics,
};
