require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
const logger = require("morgan");

const usersRoutes = require("./routes/usersRoutes");
const favoriteComicsRoutes = require("./routes/favoriteComicsRoutes");

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to MongoDB"));

app.use(express.json());
app.use(cors());
app.use(logger("combined"));

app.use("/v1/users", usersRoutes);
app.use("/v1/favoriteComics", favoriteComicsRoutes);

app.listen(3001, () => {
   console.log("server started, listening at 3001");
});
