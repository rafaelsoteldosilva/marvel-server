[![es](https://img.shields.io/badge/lang-es-green.svg)](https://github.com/rafaelsoteldosilva/marvel-server/blob/main/README.es-cl.md)

# **Marvel Server**

This is the backend part of a complete marvel project

It saves the users info and their favorite comics into a `Mongo DB` database

The project uses the `Atlas Mongo DB` cloud service, which helps the idea of not using a local database server

## **Installation guidelines**

-  `GIT clone` the repository in your hard drive
-  `cd` into the created folder, and run `npm install` in order to install all dependencies
-  As we are using a server that's in the cloud, I placed the `connection string` in an environment file (`.env`), that is also in the `.gitignore` file, so when loding up to github, it is not included, you need to create your own
-  Let's go for it
-  Get into `MongoDB Atlas` (<a href="https://www.mongodb.com/" rel="Atlas Mongo DB">Go to Atlas Mongo DB</a>)
-  Subscribe and create a database,
-  For those of you that haven't already created a collection with this Atlas Mongo DB, here's how:
   -  SignUp on the website
   -  Make sure you select the Free option
   <p align="center">
     <img src="./src/imagesForReadme/01- Create MongoDB Free.jpg" width="500" alt="01- Create MongoDB Free"/>
   </p>
   -  Create a cluster
   <p align="center">
     <img src="./src/imagesForReadme/02- Create Cluster.jpg" width="500" alt="02- Create Cluster"/>
   </p>
   -  Create a user, suppose it's (rafael, 1234)
   -  We need this for the connection string later on
   <p align="center">
     <img src="./src/imagesForReadme/03- Create User.jpg" width="500" alt="03- Create User"/>
   </p>
   -  Press `connect`
   <p align="center">
     <img src="./src/imagesForReadme/04- Database Connect.jpg" width="500" alt="04- Database Connect"/>
   </p>
   -  Add your `IP address`
   <p align="center">
     <img src="./src/imagesForReadme/05- Connect To Cluster.jpg" width="500" alt="05- Connect To Cluster"/>
   </p>
   <p align="center">
     <img src="./src/imagesForReadme/06- Add your current IP Address.jpg" width="500" alt="06- Add your current IP Address"/>
   </p>
   -  Press **Choose a connection method**
   <p align="center">
     <img src="./src/imagesForReadme/07- Choose a connection method.jpg" width="500" alt="07- Choose a connection method"/>
   </p>
   -  Choose **Connect your application**
   <p align="center">
     <img src="./src/imagesForReadme/08- Connect your Application.jpg" width="500" alt="08- Connect your Application"/>
   </p>
   -  Copy the part of the `connection string` that's like: **mongodb+srv://....mongodb.net/**, (when copying the whole string, I got some errors, so I just copied the part that's like that)
   <p align="center">
     <img src="./src/imagesForReadme/09- Add your connection string and close.jpg" width="500" alt="09- Add your connection string and close"/>
   </p>
   -  This `connection string` is what we'll type into our .env file
-  Let's give the database a name, say it's **`project`**
-  Type the user, password (suppose it's (`rafael, 1234`)) and database name in the `connection string`: **`mongodb+srv://rafael:1234@cluster0....mongodb.net/project`**,
-  Create an `.env` file in the root directory, add set the `connection string`:

```jsx
MONGODB_URI=mongodb+srv://rafael:1234@cluster0....mongodb.net/project
```

Make sure that there's no space in the connection string

-  Run **`npm start`**
-  wait for the messages:

```
server started, listening at 3001
Connected to MongoDB
```

I chose to listen to the port 3001, if you need to change it, you will have to change almost all axios calls in the frontend

## **About the project**

The project structure is as follows:

<p align="center">
  <img src="./src/imagesForReadme/theProject.jpg" alt="the Project structure"/>
</p>

This document explains the constituent parts of the project, in the same order as they are presented in `VS Code`.

The main technologies used for this project were:

-  NodeJs,
-  Expressjs,
-  Mongoose,
-  Mongo DB,
-  express.Router

<p align="center">
  <img src="./src/imagesForReadme/mongoDBAtlas.jpg" width="700" alt="Mongo DB Atlas"/>
</p>

## **endpoints**

These are the actual endpoints for each route regarding the users and the favoriteComics.

-  favoriteComicsEndpoints.js
-  userEndpoints.js

### - <ins>/src/endpoints/favoriteComicsEndpoints.js</ins>

The endpoints of this route are:

-  Get all user's favorite comics
-  Add a favorite comic to the user's collection of favorites
-  Delete a favorite comic from the user's collection of favorites
-  Delete all the user's favorite comics (this is not invoked from the front end, it's was used only in the development phase)

Almost all of them use the `query` and `body` to receive parameters from the front end. So the following sintax is an example of how to send the user id: **`"http://localhost:3001/v1/favoritecomics/?userId=" + userId`**, and the body is sent using the special axios syntax for `posts`, `deletes`, `updates`, etc..

These methods are very straight forward, for example, this is the code for the endpoint that gets all user's favorite comics:

```jsx
// Getting all user's favorite comics
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
```

As you can see, it first obtains the `userId` from the `query string` (of the user we want to get all it's favorite comics), then it asks the database for all the favorite comics this user has, sending them with a status of 200, or sending an error message with an status of 404 in case no favorite comics are found.

Now, for the delete one user's favorite comic, I had some problems trying to get a grasp of the record of the favorite comic the user wanted to delete.

I tried looking for the comic that had both the `userId` and the `comicId`:

```
let favoriteComic = await FavoriteComic.find({
   userId
   comicId,
});
```

But it didn't work, then I defined a query that built an "and" with the userId and the comicId:

```
let theQuery = {
   $and: [
      { userId: { $eq: req.query.userId } },
      { comicId: { $eq: req.query.favoriteComicId } },
   ],
};
```

But it didn't work either (I tried `Postman` and the front end itself).

I solved the problem by getting an array with all the user's favorites comics first, then search in the resulting array for the comic with the `comicId === req.query.favoriteComicId`

```jsx
// Deleting one
const deleteAUsersFavoriteComic = async (req, res) => {
   let userId = req.query.userId;
   let comicId = req.query.favoriteComicId;
   try {
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
```

### - <ins>/src/endpoints/users.js</ins>

The endpoints of this route are:

-  Get all
-  Get one
-  Delete one
-  Create one

Defining these endpoints was pretty straight forward

## **Models**

The `models` folder contains two files,

-  favoriteComic.js, and
-  user.js.

### - <ins>/src/models/favoriteComic.js</ins>

It is in charge of defining the schema of the favoriteComic collection in the database.

The collection is named `Comics`. It doesn't collide with the `comics` of the app, since those `comics` are not stored in the db

Some of the fields are:

-  `userId`: the id of the user that adds the `comic` to his/her favorites
-  `title`: the title of the `comic`
-  `description`: the description of the `comic`
-  `thumbnail`: the url of the thumbnail of the `comic`, this image is in the `Marvel API`

### - <ins>/src/models/user.js</ins>

It is in charge of defining the schema of the users collection in the database.

The collection is named `Users`

The fields are:

-  email
-  password

## **Routes**

The routes are served as middlewares, the routes are "/v1/users" and "/v1/favoriteComics" (see `/src/server.js`), these routes will expose all the endpoints that the api will have, regarding users and favoriteComics.

For example, the endpoints for the users routes are:

```jsx
// /src/routes/usersRoutes.js

// Getting all
router.route("/getAllUsers").get(UserEndpoints.getAllUsers);

// Getting one
router.route("/getAUser/:id").get(UserEndpoints.getAUser);
// The userId must be in the query string

// Creating one
router.route("/AddAUser").get(UserEndpoints.AddAUser);

// Deleting one
router.route("/deleteAUser/:id").get(UserEndpoints.deleteAUser);
// The userId must be in the query string
```

## **/src/server.js**

This is the main file of the project. in a way, it sets the whole api.

It opens the remote mongo database, then uses the middlewares:

-  express.json() to parse the `body` and converts it to a json object,
-  cors() to allow cross origin requests from the front end, and
-  logger() to log the requests, is used in development only

When connecting to the database, it uses the address `process.env.MONGODB_URI` that we defined in the .env file:

```jsx
// /src/server.js
...
mongoose.connect(process.env.MONGODB_URI);
...
```

Then sets the routes as middlewares:

```jsx
// /src/server.js
...
app.use("/v1/users", usersRoutes);
app.use("/v1/favoriteComics", favoriteComicsRoutes);
...
```

It says, for example, that for requiring the functionality `addUser`, the route shoud start with `http://localhost:3001/v1/users/addUser`

Then it listens the port 3001 for incoming `requests`
