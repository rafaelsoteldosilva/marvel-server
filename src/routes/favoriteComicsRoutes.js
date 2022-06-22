const express = require("express");
const FavoriteComicEndpoints = require("../endpoints/favoriteComicsEndpoints");
const router = express.Router();

// Getting all users favorite comics
router
   .route("/getAllUsersFavoriteComics")
   .get(FavoriteComicEndpoints.getAllUsersFavoriteComics);

// Adding one
router
   .route("/addAUsersFavoriteComic")
   .post(FavoriteComicEndpoints.addAUsersFavoriteComic);

// Deleting one
router
   .route("/deleteAUsersFavoriteComic")
   .delete(FavoriteComicEndpoints.deleteAUsersFavoriteComic);

// Deleting all
router
   .route("/deleteAllUsersFavoriteComics")
   .delete(FavoriteComicEndpoints.deleteAllUsersFavoriteComics);

module.exports = router;
