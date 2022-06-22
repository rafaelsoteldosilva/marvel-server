const mongoose = require("mongoose");

const favoriteComicSchema = new mongoose.Schema({
   userId: {
      type: String,
      required: true,
   },
   comicId: {
      type: String,
      required: true,
   },
   comicTitle: {
      type: String,
      required: true,
   },
   comicPrice: {
      type: String,
      required: true,
   },
   comicImageUrl: {
      type: String,
      required: true,
   },
   comicText: {
      type: String,
      required: true,
   },
});

module.exports = mongoose.model("Comic", favoriteComicSchema);
