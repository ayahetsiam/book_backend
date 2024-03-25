module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config/database_connection.js":
/*!***************************************!*\
  !*** ./config/database_connection.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {
  Database
} = __webpack_require__(/*! arangojs */ "arangojs");
const db = new Database({
  url: "http://localhost:8529/",
  databaseName: "livreDB",
  auth: {
    username: "root",
    password: "study"
  }
});
db.version().then(versionInfo => {
  console.log("Connexion établie avec succès !");
  console.log("Version du serveur ArangoDB :", versionInfo.version);
}).catch(err => {
  console.error("Erreur de connexion :", err);
});
module.exports = db;

/***/ }),

/***/ "./controllers/author_controller.js":
/*!******************************************!*\
  !*** ./controllers/author_controller.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * but: controller les actions crud sur un auteur
 *      et captiver les erreurs systemes
 */
const authorModel = __webpack_require__(/*! ../models/author_model */ "./models/author_model.js");
const bookModel = __webpack_require__(/*! ../models/book_model */ "./models/book_model.js");
const bookController = __webpack_require__(/*! ./book_controller */ "./controllers/book_controller.js");
class AuthorController {
  constructor() {}
  async getAuthors() {
    try {
      const authors = await authorModel.getAuthors();
      return authors;
    } catch (error) {
      console.error("Erreur lors de la récupération des auteurs: " + error.message);
      throw error;
    }
  }
  async getAuthorByKey(key) {
    this.validateKey(key);
    try {
      const author = await authorModel.getAuthorByKey(key);
      return author;
    } catch (err) {
      console.error("Erreur de récupération : " + err.message);
      throw err.message;
    }
  }
  async getBookAuthor(book_id) {
    this.validateKey(book_id);
    const book = bookController.checkBookExists(book_id);
    return this.getAuthorByKey(book.author_id);
  }
  async researchAuthor(query) {
    if (query !== "" && isNaN(parseInt(query))) {
      try {
        const researchAuthorResult = await authorModel.researchAuthor(query);
        if (researchAuthorResult.length === 0) {
          throw new Error("Aucun livre n'est trouvé");
        }
        return researchAuthorResult;
      } catch (err) {
        console.error("Erreur lors de la recherche de l'auteur : " + err.message);
        throw err;
      }
    } else {
      console.error("query non valide");
      throw new Error("query non valide");
    }
  }
  async createAuthor(nom, prenom) {
    nom = nom.trim();
    prenom = prenom.trim();
    if (!this.isCorrect(nom)) {
      throw new Error("la valeur du champ nom est incorrecte");
    }
    if (!this.isCorrect(prenom)) {
      throw new Error("la valeur du champ prenom est incorrecte");
    }
    try {
      const author = {
        nom: nom,
        prenom: prenom
      };
      return await authorModel.createAuthor(author);
    } catch (err) {
      console.error("Erreur lors de la création de l'auteur : " + err.message);
      throw err;
    }
  }
  async updateAuthor(key, nom, prenom) {
    this.validateKey(key);
    await this.checkAuthorExists(key);
    let update = {
      nom: nom,
      prenom: prenom
    };
    if (!nom) {
      update = {
        prenom: prenom
      };
    }
    if (!prenom) {
      update = {
        nom: nom
      };
    }
    if (!this.isCorrect(nom)) {
      throw new Error("la valeur du champ nom est incorrecte");
    }
    if (!this.isCorrect(prenom)) {
      throw new Error("la valeur du champ prenom est incorrecte");
    }
    try {
      return await authorModel.updateAuthor(key, update);
    } catch (err) {
      console.error("Erreur du modèle lors de la mise à jour: " + err.message);
      throw err;
    }
  }
  async deleteAuthor(key) {
    this.validateKey(key);
    const resultat = await this.checkAuthorExists(key);
    if (resultat === null) {
      throw new Error("L'auteur n'existe pas!");
    }
    const authors = await bookController.getBookByAuthor(key);
    if (Array.isArray(authors) && authors.length !== 0) {
      throw new Error("Suppression impossible! Cet auteur est lié à au moins un livre");
    }
    try {
      return await authorModel.deleteAuthor(key);
    } catch (err) {
      console.error("Erreur de suppression : " + err.message);
      throw err;
    }
  }
  validateKey(key) {
    if (key === "") {
      throw new Error("la clé n'est pas valide!");
    }
  }
  isCorrect(value) {
    return value !== "" && isNaN(parseInt(value));
  }
  async checkAuthorExists(key) {
    let author;
    try {
      author = await authorModel.getAuthorByKey(key);
    } catch {
      author = null;
    }
    if (!author) {
      throw new Error("l'auteur n'existe pas");
    }
    return author;
  }
}
module.exports = new AuthorController();

/***/ }),

/***/ "./controllers/book_controller.js":
/*!****************************************!*\
  !*** ./controllers/book_controller.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * but: controller les actions crud sur un auteur
 *      et captiver les erreurs systemes
 */

const bookModel = __webpack_require__(/*! ../models/book_model */ "./models/book_model.js");
const authorModel = __webpack_require__(/*! ../models/author_model */ "./models/author_model.js");
const authorController = __webpack_require__(/*! ./author_controller */ "./controllers/author_controller.js");
class BookController {
  constructor() {}
  async getBooks() {
    try {
      const books = await bookModel.getBooks();
      return books;
    } catch (error) {
      console.error("Erreur lors de la récupération des libres: " + error.message);
    }
  }
  async getBookByKey(key) {
    this.validateKey(key);
    try {
      return await bookModel.getBookByKey(key);
    } catch (error) {
      throw JSON.stringify(error);
    }
  }
  async getBookByISBN(isbn) {
    try {
      return await bookModel.getBookByISBN(isbn);
    } catch (error) {
      throw JSON.stringify(error);
    }
  }
  async getBookByAuthor(author_id) {
    this.validateKey(author_id);
    await checkAuthorExists(author_id);
    try {
      return bookModel.getBookbyAuthor(author_id);
    } catch (err) {
      console.error("Erreur de récuperation : " + err);
      throw err;
    }
  }
  getBooksWrittenAt(date) {
    if (date !== "") {
      try {
        return bookModel.getBooksWrittenAt(date);
      } catch (err) {
        console.error("Erreur de récuperation : " + err);
        throw err;
      }
    }
  }
  async researchBook(query) {
    query = query.trim();
    if (query === "" || !isNaN(parseInt(query))) {
      throw new Error("La requête n'est pas valide");
    }
    const results = await bookModel.researchBook(query);
    return results;
  }
  async createBook(isbn, title, oeuvre, page, author_id) {
    isbn = isbn.trim();
    title = title.trim();
    oeuvre = oeuvre.trim();
    this.validateField(isbn.trim(), title.trim(), oeuvre, page);
    const existingBook = await this.getBookByISBN(isbn);
    if (existingBook) {
      throw new Error("Ce livre existe déjà!");
    }
    if (author_id !== "") {
      let author;
      try {
        author = await getAuthorByKey(author_id);
      } catch {
        author = null;
      }
      if (!author) {
        throw new Error("Cet auteur n'existe pas!");
      }
    } else {
      throw new Error("la valeur champ book est vide!");
    }
    const date = new Date();
    const writtenAt = date.toUTCString();
    console.log(writtenAt);
    try {
      const book = {
        ISBN: isbn,
        title: title,
        oeuvre: oeuvre,
        page: page,
        author_id: author_id,
        writtenAt: writtenAt
      };
      return await bookModel.createBook(book);
    } catch (err) {
      console.error("Erreur lors de la création du livre : " + err.message);
      throw err;
    }
  }
  async updateBook(key, title, oeuvre, page) {
    this.validateKey(key);
    await this.checkBookExists(key);
    let updatedata = {};
    if (title) {
      if (!this.isCorrect(title)) {
        throw new Error("la valeur du title est incorrecte");
      }
      updatedata.title = title;
    }
    if (oeuvre) {
      if (!this.isCorrect(oeuvre)) {
        throw new Error("la valeur de l'oeuvre est incorrecte");
      }
      updatedata.oeuvre = oeuvre;
    }
    if (page) {
      if (page === "" || isNaN(parseInt(page))) {
        throw new Error("la valeur de page est incorrecte");
      }
      updatedata.page = page;
    }
    try {
      return await bookModel.updateBook(key, updatedata);
    } catch (err) {
      console.error("Erreur lors de la mise à jour : " + err.message);
      throw err;
    }
  }
  async deleteBook(key) {
    this.validateKey(key);
    await this.checkBookExists(key);
    console.log(8);
    try {
      return await bookModel.deleteBook(key);
    } catch (err) {
      console.error("Erreur de suppression : " + err.message);
      throw err;
    }
  }
  isCorrect(valeur) {
    return valeur !== "" && isNaN(parseInt(valeur));
  }
  validateField(isbn, title, oeuvre, page) {
    if (isbn === "") {
      throw new Error("la valeur du ISBN est incorrecte");
    }
    if (!this.isCorrect(title)) {
      throw new Error("la valeur du champ title est incorrecte");
    }
    if (!this.isCorrect(oeuvre)) {
      throw new Error("la valeur du champ oeuvre est incorrecte");
    }
    if (page === "" || isNaN(page)) {
      throw new Error("la valeur du champ page est incorrecte");
    }
  }
  validateKey(key) {
    if (key === "" && isNaN(parseInt(key))) {
      throw new Error("la clé n'est pas valide");
    }
  }
  async checkBookExists(key) {
    let book;
    try {
      book = await bookModel.getBookByKey(key);
    } catch {
      book = null;
    }
    if (!book) {
      throw new Error("le livre n'existe pas");
    }
    return book;
  }
}
module.exports = new BookController();

/***/ }),

/***/ "./models/author_model.js":
/*!********************************!*\
  !*** ./models/author_model.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// author_model.js
const db = __webpack_require__(/*! ../config/database_connection */ "./config/database_connection.js");
const authorCollection = db.collection("authors");
class AuthorModel {
  constructor() {}
  async getAuthors() {
    const query = await db.query("FOR author IN authors RETURN author");
    const authors = query.all();
    return authors;
  }
  async getAuthorByKey(key) {
    return await authorCollection.document(key);
  }
  async researchAuthor(researchQuery) {
    const query = await db.query(`FOR author IN authors FILTER author.nom LIKE '%${researchQuery}%' OR author.prenom LIKE '%${researchQuery}%' RETURN author`);
    return query.all();
  }
  async createAuthor(author) {
    const result = await authorCollection.save(author, {
      returnNew: true
    });
    return result.new;
  }
  async updateAuthor(key, updatedata) {
    const newAuthor = await authorCollection.update(key, updatedata, {
      returnNew: true
    });
    return newAuthor.new;
  }
  async deleteAuthor(key) {
    await authorCollection.remove(key);
    return "ok";
  }
}
module.exports = new AuthorModel();

/***/ }),

/***/ "./models/book_model.js":
/*!******************************!*\
  !*** ./models/book_model.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const db = __webpack_require__(/*! ../config/database_connection */ "./config/database_connection.js");
const bookCollection = db.collection("books");
class BookModel {
  constructor() {}
  async getBooks() {
    const query = await db.query("FOR book IN books RETURN book");
    return query.all();
  }
  async getBookByKey(key) {
    return await bookCollection.document(key);
  }
  async getBookByISBN(isbn) {
    const query = await db.query(`FOR book IN books FILTER book.ISBN == "${isbn}" RETURN book`);
    const result = await query.next();
    return result;
  }
  async getBookbyAuthor(author_id) {
    const query = await db.query(`FOR book IN books FILTER book.author_id == "${author_id}" RETURN book`);
    return query.all();
  }
  async getBooksWrittenAt(date) {
    const query = await db.query(`FOR book IN books FILTER book.author_id LIKE "%${date}%" RETURN book`);
    return query.all();
  }
  async researchBook(researchQuery) {
    const query = await db.query(`FOR book IN books FILTER book.title LIKE '%${researchQuery}%' OR book.oeuvre LIKE '%${researchQuery}%' OR book.ISDN LIKE '%${researchQuery}%' RETURN book`);
    return query.all();
  }
  async createBook(book) {
    const insertion = await bookCollection.save(book, {
      returnNew: true
    });
    return insertion.new;
  }
  async updateBook(key, updatedata) {
    const update = await bookCollection.update(key, updatedata, {
      returnNew: true
    });
    console.log(update.new);
    return update.new;
  }
  async deleteBook(key) {
    await bookCollection.remove(key);
    return "ok";
  }
}
module.exports = new BookModel();

/***/ }),

/***/ "./node_modules/graphpack/config/index.js":
/*!************************************************!*\
  !*** ./node_modules/graphpack/config/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const cosmiconfig = __webpack_require__(/*! cosmiconfig */ "cosmiconfig");
const webpack = __webpack_require__(/*! webpack */ "webpack");
const defaultConfig = __webpack_require__(/*! ./webpack.config */ "./node_modules/graphpack/config/webpack.config.js");
const explorer = cosmiconfig('graphpack').search();
const loadServerConfig = async () => {
  const result = await explorer;
  const userConfig = result ? typeof result.config === 'function' ? result.config(defaultConfig.mode) : result.config : {};
  return {
    port: Number(process.env.PORT),
    ...userConfig.server
  };
};
const loadWebpackConfig = async () => {
  const result = await explorer;
  const userConfig = result ? typeof result.config === 'function' ? result.config(defaultConfig.mode) : result.config : {};
  if (typeof userConfig.webpack === 'function') {
    return userConfig.webpack({
      config: defaultConfig,
      webpack
    });
  }
  return {
    ...defaultConfig,
    ...userConfig.webpack
  };
};
exports.loadServerConfig = loadServerConfig;
exports.loadWebpackConfig = loadWebpackConfig;

/***/ }),

/***/ "./node_modules/graphpack/config/webpack.config.js":
/*!*********************************************************!*\
  !*** ./node_modules/graphpack/config/webpack.config.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const FriendlyErrorsWebpackPlugin = __webpack_require__(/*! friendly-errors-webpack-plugin */ "friendly-errors-webpack-plugin");
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const webpack = __webpack_require__(/*! webpack */ "webpack");
const nodeExternals = __webpack_require__(/*! webpack-node-externals */ "webpack-node-externals");
const isDev = "development" !== 'production';
const isWebpack = typeof __webpack_require__.m === 'object';
const hasBabelRc = fs.existsSync(path.resolve('babel.config.js'));
if (hasBabelRc && !isWebpack) {
  console.info('🐠 Using babel.config.js defined in your app root');
}
module.exports = {
  devtool: 'source-map',
  entry: {
    // We take care of setting up entry file under lib/index.js
    index: ['graphpack']
  },
  // When bundling with Webpack for the backend you usually don't want to bundle
  // its node_modules dependencies. This creates an externals function that
  // ignores node_modules when bundling in Webpack.
  externals: [nodeExternals({
    whitelist: [/^graphpack$/]
  })],
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      test: /\.(gql|graphql)/,
      use: 'graphql-tag/loader'
    }, {
      test: /\.(js|ts)$/,
      use: [{
        loader: /*require.resolve*/(/*! babel-loader */ "babel-loader"),
        options: {
          babelrc: true,
          cacheDirectory: true,
          presets: hasBabelRc ? undefined : [/*require.resolve*/(/*! babel-preset-graphpack */ "babel-preset-graphpack")]
        }
      }]
    }, {
      test: /\.mjs$/,
      type: 'javascript/auto'
    }]
  },
  node: {
    __filename: true,
    __dirname: true
  },
  optimization: {
    noEmitOnErrors: true
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(process.cwd(), './build'),
    sourceMapFilename: '[name].map'
  },
  performance: {
    hints: false
  },
  plugins: [new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1
  }), new webpack.EnvironmentPlugin({
    DEBUG: false,
    GRAPHPACK_SRC_DIR: path.resolve(process.cwd(), 'src'),
    NODE_ENV: 'development'
  }), new FriendlyErrorsWebpackPlugin({
    clearConsole: isDev
  })],
  resolve: {
    extensions: ['.ts', '.js']
  },
  stats: 'minimal',
  target: 'node'
};

/***/ }),

/***/ "./node_modules/graphpack/lib/server.js":
/*!**********************************************!*\
  !*** ./node_modules/graphpack/lib/server.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-server */ "apollo-server");
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _srcFiles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./srcFiles */ "./node_modules/graphpack/lib/srcFiles.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./node_modules/graphpack/config/index.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_config__WEBPACK_IMPORTED_MODULE_3__);




if (!(_srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"] && Object.keys(_srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"]).length > 0)) {
  throw Error(`Couldn't find any resolvers. Please add resolvers to your src/resolvers.js`);
}
const createServer = config => {
  const {
    applyMiddleware,
    port: serverPort,
    ...options
  } = config;
  const port = Number(process.env.PORT) || serverPort || 4000;
  // Pull out fields that are not relevant for the apollo server

  // Use apollo-server-express when middleware detected
  if (applyMiddleware && applyMiddleware.app && typeof applyMiddleware.app.listen === 'function') {
    const server = new apollo_server_express__WEBPACK_IMPORTED_MODULE_1__["ApolloServer"](options);
    server.applyMiddleware(applyMiddleware);
    return applyMiddleware.app.listen({
      port
    }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
  }

  // Use apollo-server
  const server = new apollo_server__WEBPACK_IMPORTED_MODULE_0__["ApolloServer"](options);
  return server.listen({
    port
  }).then(({
    url
  }) => console.log(`🚀 Server ready at ${url}`));
};
const startServer = async () => {
  // Load server config from graphpack.config.js
  const config = await Object(_config__WEBPACK_IMPORTED_MODULE_3__["loadServerConfig"])();
  createServer({
    ...config,
    context: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["context"],
    resolvers: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"],
    typeDefs: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["typeDefs"]
  });
};
startServer();

/***/ }),

/***/ "./node_modules/graphpack/lib/srcFiles.js":
/*!************************************************!*\
  !*** ./node_modules/graphpack/lib/srcFiles.js ***!
  \************************************************/
/*! exports provided: importFirst, context, resolvers, typeDefs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importFirst", function() { return importFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "context", function() { return context; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolvers", function() { return resolvers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeDefs", function() { return typeDefs; });
const importFirst = req => req.keys().map(mod => req(mod).default || req(mod))[0];

// Optionally import modules
const context = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$"));
const resolvers = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$"));
const typeDefs = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$"));

/***/ }),

/***/ "./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$":
/*!**********************************************************!*\
  !*** ./src sync ^\.\/(context|context\/index)\.(js|ts)$ ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$";

/***/ }),

/***/ "./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$":
/*!**************************************************************!*\
  !*** ./src sync ^\.\/(resolvers|resolvers\/index)\.(js|ts)$ ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./resolvers.js": "./src/resolvers.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$";

/***/ }),

/***/ "./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$":
/*!********************************************************************!*\
  !*** ./src sync ^\.\/(schema|schema\/index)\.(gql|graphql|js|ts)$ ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./schema.graphql": "./src/schema.graphql"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$";

/***/ }),

/***/ "./src/resolvers.js":
/*!**************************!*\
  !*** ./src/resolvers.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// resolvers.js
const authorController = __webpack_require__(/*! ../controllers/author_controller */ "./controllers/author_controller.js");
const bookController = __webpack_require__(/*! ../controllers/book_controller */ "./controllers/book_controller.js");
const resolvers = {
  Query: {
    //author
    authors: () => authorController.getAuthors(),
    author: (_, {
      key
    }) => authorController.getAuthorByKey(key),
    researchAuthor: (_, {
      query
    }) => authorController.researchAuthor(query),
    //book
    books: () => bookController.getBooks(),
    book: (_, {
      key
    }) => bookController.getBookByKey(key),
    researchBook: (_, {
      query
    }) => bookController.researchBook(query),
    authorsBooks: (_, {
      author_id
    }) => bookController.getBooksByAuthor(author_id),
    booksAuthor: (_, {
      book_id
    }) => authorController.getBookAuthor(book_id),
    bookisbn: (_, {
      isbn
    }) => __webpack_require__(/*! ../models/book_model */ "./models/book_model.js").default.getBookByISBN(isbn)
  },
  Mutation: {
    //author
    createAuthor: (_, {
      nom,
      prenom
    }) => authorController.createAuthor(nom, prenom),
    updateAuthor: (_, {
      key,
      nom,
      prenom
    }) => authorController.updateAuthor(key, nom, prenom),
    deleteAuthor: (_, {
      key
    }) => authorController.deleteAuthor(key),
    //book
    createBook: (_, {
      isbn,
      title,
      oeuvre,
      page,
      author_id
    }) => bookController.createBook(isbn, title, oeuvre, page, author_id),
    updateBook: (_, {
      key,
      title,
      oeuvre,
      page
    }) => bookController.updateBook(key, title, oeuvre, page),
    deleteBook: (_, {
      key
    }) => bookController.deleteBook(key)
  }
};
/* harmony default export */ __webpack_exports__["default"] = (resolvers);

/***/ }),

/***/ "./src/schema.graphql":
/*!****************************!*\
  !*** ./src/schema.graphql ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Author"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"nom"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"prenom"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Book"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ISBN"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"title"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"oeuvre"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"page"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"author_id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"writtenAt"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"authors"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"author"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"researchAuthor"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"query"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"books"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"book"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"bookisbn"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"isbn"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"researchBook"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"query"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"authorsBooks"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"author_id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"booksAuthor"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"book_id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"createAuthor"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"nom"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"prenom"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateAuthor"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"nom"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"prenom"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteAuthor"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createBook"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"isbn"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"oeuvre"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"page"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"author_id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateBook"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"oeuvre"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"page"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteBook"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]}],"loc":{"start":0,"end":1013}};
    doc.loc.source = {"body":"#Author\r\ntype Author {\r\n  _id: ID!\r\n  nom: String!\r\n  prenom: String!\r\n  #books: [Book]\r\n}\r\n\r\n#book\r\ntype Book {\r\n  _id: ID!\r\n  ISBN: ID!\r\n  title: String!\r\n  oeuvre: String!\r\n  page: Int!\r\n  author_id: String!\r\n  writtenAt: String!\r\n}\r\n\r\n#Query\r\ntype Query {\r\n  #author\r\n  authors: [Author!]!\r\n  author(key: ID!): Author!\r\n  researchAuthor(query: String!): [Author!]!\r\n\r\n  #book\r\n  books: [Book!]!\r\n  book(key: ID): Book!\r\n  bookisbn(isbn: ID): Book!\r\n  researchBook(query: String!): [Book!]\r\n\r\n  authorsBooks(author_id: ID!): [Book!]!\r\n  booksAuthor(book_id: ID!): Author!\r\n}\r\n\r\ntype Mutation {\r\n  #Auteur\r\n  createAuthor(nom: String!, prenom: String!): Author!\r\n  updateAuthor(key: ID!, nom: String, prenom: String): Author!\r\n  deleteAuthor(key: ID!): String!\r\n\r\n  #book\r\n  createBook(\r\n    isbn: String!\r\n    title: String!\r\n    oeuvre: String!\r\n    page: Int!\r\n    author_id: String!\r\n  ): Book!\r\n\r\n  updateBook(key: ID!, title: String, oeuvre: String, page: Int): Book!\r\n  deleteBook(key: ID!): String!\r\n}\r\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

      module.exports = doc;
    


/***/ }),

/***/ 0:
/*!***********************!*\
  !*** multi graphpack ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! graphpack */"./node_modules/graphpack/lib/server.js");


/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "arangojs":
/*!***************************!*\
  !*** external "arangojs" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("arangojs");

/***/ }),

/***/ "babel-loader":
/*!*******************************!*\
  !*** external "babel-loader" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-loader");

/***/ }),

/***/ "babel-preset-graphpack":
/*!*****************************************!*\
  !*** external "babel-preset-graphpack" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-preset-graphpack");

/***/ }),

/***/ "cosmiconfig":
/*!******************************!*\
  !*** external "cosmiconfig" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cosmiconfig");

/***/ }),

/***/ "friendly-errors-webpack-plugin":
/*!*************************************************!*\
  !*** external "friendly-errors-webpack-plugin" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("friendly-errors-webpack-plugin");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),

/***/ "webpack-node-externals":
/*!*****************************************!*\
  !*** external "webpack-node-externals" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-node-externals");

/***/ })

/******/ });
//# sourceMappingURL=index.map