[![en](https://img.shields.io/badge/lang-en-blue.svg)](https://github.com/rafaelsoteldosilva/marvel-server/blob/main/README.md)

# **Marvel Server**

Este es la parte backend del proyecto completo Marvel

Guarda la información de los usuarios y sus comics favoritos en la base de datos `Mongo DB`

El proyecto usa el servicio en la nube `Atlas Mongo DB`, el cual ayuda en la idea de no usar un servicio de servidor de bases de datos local

## **Guía de Instalación**

-  Haga `GIT Clone` del repo en su disco duro
-  `cd` dentro del directorio creado, y ejecute `run install` para que se instalen todas las dependencias
-  Ya que estamos usando un servidor que está en la nube, coloqué el `connection string` en un archivo de ambiente `.env`, que también está en el archivo `.gitignore`, por lo que cuando hice la carga al `github` este no se incluyó, necesita crear uno propio
-  Hagamos eso
-  Entre en website `MongoDB Atlas` (<a href="https://www.mongodb.com/" rel="Atlas Mongo DB">Ir a Atlas Mongo DB</a>)
-  Subscríbase y cree una base de datos
-  Para aquellos que no han creado una colección con Atlas Mongo DB, aquí está el cómo:

   -  Signup en el website
   -  Asegúrese de escojer la opción gratis

   <p align="center">
     <img src="./src/imagesForReadme/01- Create MongoDB Free.jpg" width="500" alt="01- Create MongoDB Free"/>
   </p>

   -  Cree un cluster

   <p align="center">
     <img src="./src/imagesForReadme/02- Create Cluster.jpg" width="500" alt="02- Create Cluster"/>
   </p>

   -  Cree un usuario, supongamos que es (rafael, 1234)
   -  Necesitamos esta información para más adelante

   <p align="center">
     <img src="./src/imagesForReadme/03- Create User.jpg" width="500" alt="03- Create User"/>
   </p>

   -  Presione `connect`

   <p align="center">
     <img src="./src/imagesForReadme/04- Database Connect.jpg" width="500" alt="04- Database Connect"/>
   </p>

   -  Agregue su `IP address`

   <p align="center">
     <img src="./src/imagesForReadme/05- Connect To Cluster.jpg" width="500" alt="05- Connect To Cluster"/>
   </p>
   <p align="center">
     <img src="./src/imagesForReadme/06- Add your current IP Address.jpg" width="500" alt="06- Add your current IP Address"/>
   </p>

   -  Presione **Choose a connection method**

   <p align="center">
     <img src="./src/imagesForReadme/07- Choose a connection method.jpg" width="500" alt="07- Choose a connection method"/>
   </p>

   -  Presione **Connect your application**

   <p align="center">
     <img src="./src/imagesForReadme/08- Connect your Application.jpg" width="500" alt="08- Connect your Application"/>
   </p>

   -  Copie la parte del `connection string` que es como: **mongodb+srv://....mongodb.net/**, (cuando copio el string completo, me salen errores, por eso copio sólo lo que indico)

   <p align="center">
     <img src="./src/imagesForReadme/09- Add your connection string and close.jpg" width="500" alt="09- Add your connection string and close"/>
   </p>

   -  Este `connection string` es lo que tipearemos en el `.env`
   -  Démosle a la base de datos un nombre, supongamos que es `project`

   -  Escriba el/la usuario, password (supongamos que es (`rafael, 1234`)) y el nopmbre de la base de datos en el `connection string`
   -  Type the user, password (suppose it's (`rafael, 1234`)) and database name in the connection string: **`mongodb+srv://rafael:1234@cluster0....mongodb.net/project**,

-  Cree un archivo `.env` en el directorio raiz del projecto, y setee el `connection string`:

```jsx
MONGODB_URI=mongodb+srv://rafael:1234@cluster0....mongodb.net/project
```

Asegúrese de que no hayan espacios en blanco en el `connection string`

-  Ejecute **`npm start`**
-  Espere por los mensajes:

```
server started, listening at 3001
Connected to MongoDB
```

Yo escojí escuchar el puerto 3001, si necesita cambiarlo, tendrá que cambiar también las llamadas de axios en el frontend

## **Sobre el proyecto**

El estructura del proyecto es la siguiente:

<p align="center">
  <img src="./src/imagesForReadme/theProject.jpg" alt="the Project structure"/>
</p>

Este documento explica las partes constituyentes del proyecto, en el mismo orden en el que aparecen en `VS Code`

Las principales tecnologías usadas en este proyecto son:

-  NodeJs,
-  Expressjs,
-  Mongoose,
-  Mongo DB,
-  express.Router

<p align="center">
  <img src="./src/imagesForReadme/mongoDBAtlas.jpg" width="700" alt="Mongo DB Atlas"/>
</p>

## **endpoints**

Estos son los endpoint reales de cada ruta en relación a los usuarios y a favoriteComics

-  favoriteComicsEndpoints.js
-  userEndpoints.js

### - <ins>/src/endpoints/favoriteComicsEndpoints.js</ins>

Los endpoints de esta ruta son:

-  Obtener todos los comic favoritos de un usuario
-  Añadir un comic favorito a la colección de comics favoritos de un usuario
-  Eliminar un comic favorito de la colección de comics favoritos de un usuario
-  Eliminar todos los comics favoritos de un usuario (este fue usado sólo en la fase de desarrollo)

Casi todos ellos usan el query y el body para recibir parámetros del front end. Por lo que la siguiente sintaxis en un ejemplo de cómo enviar el id de usuario: **`"http://localhost:3001/v1/favoritecomics/?userId=" + userId`**, y el `body` es enviado usando la sintaxis especial de axio para `posts`, `deletes`, `updates`, etc..

Estos métodos son muy directos y sencillos, por ejemplo, este es el código para el endpoint que obtiene todos los comics favoritos de un usuario:

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

Como puede ver, primero obtiene el `userId` del `query string` (del usuario para el/la que queremos obtener todos sus comics favoritos), y luego busca en la base de datos todos los comics favoritos de ese usuario, enviando la data de vuelta con estatus 200, o enviando un mensaje de error con estatus 404 en caso de que no heyan encontrado favoritos.

Ahora, para eliminar un comic favorito de un usuario, tuve ciertos problemas intentando obtener el registro del comic favorito que el/la usuario quería eliminar

Intenté buscar el comic que tenía ambos `userId` y `comicId`

```
let favoriteComic = await FavoriteComic.find({
   userId
   comicId,
});
```

Pero esto no funcionó, luego definí un `query` que construía un `and` entre el `userId` y el `comicId`:

```
let theQuery = {
   $and: [
      { userId: { $eq: req.query.userId } },
      { comicId: { $eq: req.query.favoriteComicId } },
   ],
};
```

Pero tampoco funcionó (intenté con `Postman` y el mismo front end)

Resolví el problema obteniendo un arreglo de todos los comics favoritos del usuario primero, luego buscando en el array resultante aquel comic con `comicId === req.query.favoriteComicId`

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

Los endpoints de esta ruta son:

-  Obtener todos
-  Obtener uno
-  Eliminar uno
-  Añadir uno

Definir estos endpoints fué muy directo

## **Models**

El directorio `models` contiene dos archivos:

-  favoriteComic.js, y
-  user.js.

### - <ins>/src/models/favoriteComic.js</ins>

Está a cargo de definir el esquema de la colección de favoriteComics en la base de datos.

Esta colección está llamada `Comics`. Esto no choca con los `comics` de la aplicación, ya que esos `comics` no son guardados en la base de datos

Algunos campos son:

-  `userId`: el Id del usuario que añade el `comic` a su lista de favoritos
-  `title`: el título del `comic`
-  `description`: la descripción del `comic`
-  `thumbnail`: la `url` del la imagen thumbnail del `comic`, esta imagen se encuentra en la `Marvel API`

### - <ins>/src/models/user.js</ins>

esta a cargo de definir el esquema de la colección de usarios de la base de datos

The collection is named `Users`

Los campos son:

-  email
-  password

## **Routes**

Las rutas son servidas como `middlewares`, las rutas son `/v1/users` y `/v1/favoriteComics` (ver `/src/server.js`), estas rutas exponen todos los endpoints que tendrá la app, respecto a `users` y `favoriteComics`

Por ejemplo, los endpoints de la ruta de usuario son:

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

este es el archivo principal del proyecto, de cierta forma, construye toda la app.

Abre la base de datos remota de Mongo DB, y usa los siguiente middlewares:

-  express.json(), analiza el `body` y lo convierte en un objeto JSON
-  cors(), para permitir `requests` de varios orígenes desde el front end, y
-  logger(), para registrar los requests, se usa sólo en desarrollo

Cuando se conecta con la base de datos, usa la dirección de `process.env.MONGODB_URI` que definimos en el archivo `.env`

```jsx
// /src/server.js
mongoose.connect(process.env.MONGODB_URI);
```

Setea también las rutas como middlewares:

```jsx
// /src/server.js
...
app.use("/v1/users", usersRoutes);
app.use("/v1/favoriteComics", favoriteComicsRoutes);
...
```

Esto dice, por ejemplo, que para requerir la funcionalidad `addUser`, la ruta debería comenzar con `http://localhost:3001/v1/users/addUser`

Después escucha el puerto 3001 por `requests` entrantes
