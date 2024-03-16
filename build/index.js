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
  databaseName: "bookDB",
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
class AuthorController {
  constructor() {}
  async getAuthors() {
    try {
      const authors = await authorModel.getAuthors();
      if (authors.length === 0) {
        throw new Error("Aucun auteur trouvé");
      }
      return authors;
    } catch (error) {
      console.error("Erreur lors de la récupération des auteurs: " + error.message);
      throw error;
    }
  }
  async getAuthorByKey(key) {
    try {
      const author = await authorModel.getAuthorByKey(key);
      if (!author) {
        throw new Error("Aucun auteur trouvé");
      }
      return author;
    } catch (err) {
      console.error("Erreur de récupération : " + err.message);
      throw err;
    }
  }
  async getAuthorById(id) {
    if (id === "") {
      throw new Error("L'id n'est pas vailidé");
    }
    const authors = await this.getAuthors();
    const author = authors.find(author => author._id == id);
    if (author == null) {
      throw new Error("Aucun auteur trouvé");
    }
    return author;
  }
  async researchAuthor(query) {
    if (query !== "" && !isNaN(parseInt(query))) {
      try {
        const authors = await this.getAuthors();
        return await authorModel.researchAuthor(query, authors);
      } catch (err) {
        console.error("Erreur lors de la recherche de l'auteur : " + err.message);
        throw err;
      }
    }
  }
  async createAuthor(nom, prenom) {
    if (!this.isCorrect(nom, prenom)) {} else {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
    try {
      return await authorModel.createAuthor(nom, prenom);
    } catch (err) {
      console.error("Erreur lors de la création de l'auteur : " + err.message);
      throw err;
    }
  }
  async updateAuthor(key, nom, prenom) {
    if (!this.isCorrect(nom, prenom)) {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
    try {
      return await authorModel.updateAuthor(key, nom, prenom);
    } catch (err) {
      console.error("Erreur du modèle lors de la mise à jour: " + err.message);
      throw err;
    }
  }
  async deleteAuthor(key) {
    try {
      return await authorModel.deleteAuthor(key);
    } catch (err) {
      console.error("Erreur de suppression : " + err.message);
      throw err;
    }
  }
  isCorrect(nom, prenom) {
    return nom !== "" && prenom !== "" && isNaN(parseInt(nom)) && isNaN(parseInt(prenom));
  }
  async checkAuthorExists(id) {
    const authors = await this.getAuthors();
    return authors.some(author => author._id === id);
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
class BookController {
  constructor() {}
  async getBooks() {
    //let books = null;
    try {
      const books = await bookModel.getBooks();
      return books;
    } catch (error) {
      console.error("Erreur lors de la récupération des libres: " + error.message);
    }
    /*if (books.length === 0) {
      throw new Error("Aucun livre");
    }*/
  }
  async getBookByKey(key) {
    this.validateKey(key);
    const book = await bookModel.getBookByKey(key);
    if (book === null) {
      throw new Error("Aucun livre trouvé");
    }
    return book;
  }
  async getBookById(id) {
    if (id === "") {
      throw new Error("L'id n'est pas vailidé");
    }
    const books = await this.getBooks();
    const book = books.find(book => book._id == id);
    if (book == null) {
      throw new Error("Aucun livre trouvé");
    }
    return book;
  }
  async researchBook(query) {
    if (query === "" || isNaN(parseInt(query))) {
      throw new Error("La requête n'est pas valide");
    }
    const books = await this.getBooks();
    const results = await bookModel.researchBook(query, books);
    return results;
  }
  async createBook(isbn, title, oeuvre) {
    if (isbn === "" || isNaN(parseInt(isbn)) || !this.isCorrect(title, oeuvre)) {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
    if (await this.isIsbnExist(isbn)) {
      throw new Error("Ce livre existe déjà!");
    }
    try {
      return await bookModel.createBook(isbn, title, oeuvre);
    } catch (err) {
      console.error("Erreur lors de la création du livre : " + err.message);
      throw err; // Re-lance l'erreur pour la gestion par le code appelant
    }
  }
  async updateBook(key, title, oeuvre) {
    this.validateKey(key);
    if (!this.isCorrect(title, oeuvre)) {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
    try {
      return await bookModel.updateBook(key, title, oeuvre);
    } catch (err) {
      console.error("Erreur lors de la mise à jour : " + err.message);
      throw err; // Re-lance l'erreur pour la gestion par le code appelant
    }
  }
  async deleteBook(key) {
    this.validateKey(key);
    try {
      return await bookModel.deleteBook(key);
    } catch (err) {
      console.error("Erreur de suppression : " + err.message);
      throw err; // Re-lance l'erreur pour la gestion par le code appelant
    }
  }
  isCorrect(title, oeuvre) {
    return title !== "" && oeuvre !== "" && isNaN(parseInt(title)) && isNaN(parseInt(oeuvre));
  }
  async isIsbnExist(isbn) {
    const books = await this.getBooks();
    return books.some(book => book.isbn === isbn);
  }
  async validateKey(key) {
    if (key === "" && isNaN(parseInt(key))) {
      throw new Error("la clé n'est pas valide");
    }
  }
  async checkBookExists(id) {
    const books = await this.getBooks();
    return books.some(book => book._id == id);
  }
}
module.exports = new BookController();

/***/ }),

/***/ "./controllers/written_controller.js":
/*!*******************************************!*\
  !*** ./controllers/written_controller.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * but: controller les actions crud sur un auteur
 *      et captiver les erreurs systemes
 */
const writtenModel = __webpack_require__(/*! ../models/written_model */ "./models/written_model.js");
const bookController = __webpack_require__(/*! ./book_controller */ "./controllers/book_controller.js");
const auteurController = __webpack_require__(/*! ./author_controller */ "./controllers/author_controller.js");
class WrittenController {
  constructor() {}
  async getWrittens() {
    try {
      const writtens = await writtenModel.getWrittens();
      /*if (writtens.length === 0) {
        throw new Error("Aucune donnéé");
      }*/
      return writtens;
    } catch (error) {
      console.error("Erreur lors de la récupération des livres : " + error.message);
      throw error;
    }
  }
  async getWrittenByKey(key) {
    this.validateId(key);
    try {
      const written = await writtenModel.getWrittenByKey(key);
      if (!written) {
        throw new Error("Aucun livre trouvé");
      }
      return written;
    } catch (err) {
      console.error("Erreur de récupération : " + err.message);
      throw err;
    }
  }
  async researchWritten(query) {
    if (query !== "" && !isNaN(parseInt(query))) {
      try {
        const writtens = await this.getWrittens();
        const results = await writtenModel.researchWritten(query, writtens);
        if (results.length === 0) {
          throw new Error("Aucun résultat");
        }
        return results;
      } catch (err) {
        console.error("Erreur lors de la recherche du livre : " + err.message);
        throw err;
      }
    }
  }
  async createWritten(book_id, author_id) {
    if (await this.isCorrect(book_id, author_id)) {
      console.log("ama");
      try {
        const newDate = new Date().toISOString();
        return await writtenModel.createWritten(book_id, author_id, newDate);
      } catch (err) {
        console.error("Erreur lors de la création du livre : " + err.message);
        throw err;
      }
    } else {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
  }
  async updateWritten(key, book_id, author_id) {
    this.validateKey(key);
    if (this.isCorrect(book_id, author_id)) {
      try {
        return await writtenModel.updateWritten(key, book_id, author_id);
      } catch (err) {
        console.error("Erreur lors de la mise à jour : " + err.message);
        throw err;
      }
    } else {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
  }
  async deleteWritten(key) {
    this.validateKey(key);
    try {
      return await writtenModel.deleteWritten(key);
    } catch (err) {
      // console.error("Erreur de suppression : " + err.message);
      throw err;
    }
  }
  async checkRelationUnique(book_id, author_id) {
    try {
      const writtens = await this.getWrittens();
      return !writtens.some(w => w._from == book_id && w._to == author_id);
    } catch (error) {
      console.error("Erreur lors de la vérification de l'unicité de la relation :", error.message);
      throw error;
    }
  }
  async isCorrect(book_id, author_id) {
    if (book_id === "" && !isNaN(parseInt(book_id))) {
      throw new Error("l'id du livre n'est pas valide");
    }
    if (author_id === "" && !isNaN(parseInt(author_id))) {
      throw new Error("l'id de l'auteur n'est pas valide");
    }
    try {
      const bookExists = await bookController.checkBookExists(book_id);
      console.log(bookExists);
      const authorExists = await auteurController.checkAuthorExists(author_id);
      console.log(authorExists);
      const relationUnique = await this.checkRelationUnique(book_id, author_id);
      console.log(relationUnique);
      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de la relation:", error);
      throw error;
    }
  }
  async validateKey(key) {
    if (key === "" && isNaN(parseInt(key))) {
      throw new Error("la clé n'est pas valide");
    }
  }
}
module.exports = new WrittenController();

/***/ }),

/***/ "./models/author_model.js":
/*!********************************!*\
  !*** ./models/author_model.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// author_model.js
const db = __webpack_require__(/*! ../config/database_connection */ "./config/database_connection.js");
const authorCollection = db.collection("author");
class AuthorModel {
  constructor() {}
  async getAuthors() {
    const query = await db.query("FOR author IN author RETURN author");
    const authors = query.all();
    return authors;
  }
  async getAuthorByKey(key) {
    return await authorCollection.document(key);
  }
  async researchAuthor(query, authors) {
    const researchauthors = await authors.filter(a => {
      return a.nom.includes(query) || a.prenom.includes(query);
    });
    return researchauthors;
  }
  async createAuthor(nom, prenom) {
    const author = {
      nom: nom,
      prenom: prenom
    };
    const result = await authorCollection.save(author);
    return this.getAuthorByKey(result._key);
  }
  async updateAuthor(key, newNom, newPrenom) {
    const newAuthor = await authorCollection.update(key, {
      nom: newNom,
      prenom: newPrenom
    }, {
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
const bookCollection = db.collection("book");
class BookModel {
  constructor() {}
  async getBooks() {
    const query = await db.query("FOR book IN book RETURN book");
    return query.all();
  }
  async getBookByKey(key) {
    return await bookCollection.document(key);
  }
  async getBookById(id) {
    const query = db.query(`
    FOR book IN book
    FILTER book._id == ${id}
    RETURN book
  `);
    return await db.query(query);
  }
  async researchBook(query) {
    const books = await this.getBooks();
    return books.filter(b => b.oeuvre.includes(query) || b.title.includes(query));
  }
  async createBook(isdn, oeuvre, title) {
    a;
    const book = {
      ISDN: isdn,
      title: title,
      oeuvre: oeuvre
    };
    const insertion = await bookCollection.save(book);
    const newbook = await bookCollection.document(insertion._key);
    return newbook;
  }
  async createBook(isdn, title, oeuvre) {
    const book = {
      ISDN: isdn,
      title: title,
      oeuvre: oeuvre
    };
    const insertion = await bookCollection.save(book);
    const newbook = await bookCollection.document(insertion._key);
    return newbook;
  }
  async updateBook(key, title, oeuvre) {
    const update = await bookCollection.update(key, {
      title: title,
      oeuvre: oeuvre
    }, {
      returnNew: true
    });
    return update.new;
  }
  async deleteBook(key) {
    await bookCollection.remove(key);
    return "ok";
  }
}
module.exports = new BookModel();

/***/ }),

/***/ "./models/written_model.js":
/*!*********************************!*\
  !*** ./models/written_model.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const db = __webpack_require__(/*! ../config/database_connection */ "./config/database_connection.js");
const writtenCollection = db.collection("written");
class WrittenModel {
  constructor() {}
  async getWrittens() {
    const query = await db.query("FOR written IN written RETURN written");
    return query.all();
  }
  async getWrittenByKey(key) {
    return await writtenCollection.document(key);
  }
  async getWrittenById(id) {
    const query = await db.query(`FOR w IN iswritten FILTER w._from == ${id} RETURN w`);
    return await query.all(); // Si aucun résultat, la relation est unique
  }
  async researchWritten(query) {
    const writtens = this.getWrittens();
    return (await writtens).filter(w => w.author.nom.includes(query) || w.author.prenom.includes(query) || w.book.title.includes(query) || w.book.oeuvre.includes(query));
  }
  async createWritten(book_id, author_id, date) {
    const insertion = await writtenCollection.save({
      _from: book_id,
      _to: author_id,
      writtenAt: date
    });
    const newwritten = await writtenCollection.edges(insertion._key);
    return newwritten;
  }
  async createWritten(isdn, title, oeuvre) {
    const written = {
      ISDN: isdn,
      title: title,
      oeuvre: oeuvre
    };
    const insertion = await writtenCollection.save(written);
    const newWritten = await writtenCollection.document(insertion._key);
    return newWritten;
  }
  async updateWritten(key, title, oeuvre) {
    const update = await writtenCollection.update(key, {
      title: title,
      oeuvre: oeuvre
    }, {
      returnNew: true
    });
    return update.new;
  }
  async deleteWritten(key) {
    await writtenCollection.remove(key);
    return "ok";
  }
  async checkByAuthor(author) {
    const query = await db.query(`FOR w IN written FILTER w._to == ${author._id} RETURN w`);
    return await query.all();
  }
  async checkByBook(book) {
    const query = await db.query(`FOR w IN iswritten FILTER w._from == ${book._id} RETURN w`);
    return await query.all(); // Si aucun résultat, la relation est unique
  }
}
module.exports = new WrittenModel();

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
const writtenController = __webpack_require__(/*! ../controllers/written_controller */ "./controllers/written_controller.js");
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
    //writting book relation
    bookWritten: () => writtenController.getWrittens(),
    book: (_, {
      key
    }) => bookController.getBookByKey(key),
    researchBook: (_, {
      query
    }) => bookController.researchBook(query)
    //bookbyid: (_, { book, author }) => writtenController.isCorrect(book, author),
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
      oeuvre
    }) => bookController.createBook(isbn, title, oeuvre),
    updateBook: (_, {
      key,
      title,
      oeuvre
    }) => bookController.updateBook(key, title, oeuvre),
    deleteBook: (_, {
      key
    }) => bookController.deleteBook(key),
    //relation between them:writtenBy
    createWritten: (_, {
      book,
      author
    }) => writtenController.createWritten(book, author)
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


    var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Author"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"nom"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"prenom"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Book"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"ISBN"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"title"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"oeuvre"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Iswritten"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"author"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"book"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"writtenAt"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"authors"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"author"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"researchAuthor"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"query"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"books"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"book"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"researchBook"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"query"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"bookWritten"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Iswritten"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"createAuthor"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"nom"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"prenom"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateAuthor"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"nom"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"prenom"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteAuthor"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createBook"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"isbn"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"oeuvre"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateBook"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"oeuvre"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Book"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteBook"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createWritten"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"book_id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"author_id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Iswritten"}},"directives":[]}]}],"loc":{"start":0,"end":906}};
    doc.loc.source = {"body":"#Author\r\ntype Author {\r\n  nom: String!\r\n  prenom: String!\r\n}\r\n\r\n#book\r\ntype Book {\r\n  ISBN: ID!\r\n  title: String!\r\n  oeuvre: String!\r\n}\r\n\r\n#written\r\ntype Iswritten {\r\n  author: Author\r\n  book: Book\r\n  writtenAt: String\r\n}\r\n\r\ntype Query {\r\n  #author\r\n  authors: [Author]\r\n  author(key: ID!): Author\r\n  researchAuthor(query: String): [Author]\r\n\r\n  #book\r\n  books: [Book]\r\n  book(key: ID): Book\r\n  researchBook(query: String): [Book]\r\n\r\n  #written\r\n  bookWritten: [Iswritten]\r\n}\r\n\r\ntype Mutation {\r\n  #Auteur\r\n  createAuthor(nom: String, prenom: String): Author!\r\n  updateAuthor(key: ID!, nom: String!, prenom: String!): Author!\r\n  deleteAuthor(key: ID!): String\r\n\r\n  #book\r\n  createBook(isbn: String, title: String, oeuvre: String): Book!\r\n  updateBook(key: ID, title: String, oeuvre: String): Book!\r\n  deleteBook(key: ID!): String\r\n\r\n  #writtenBy\r\n  createWritten(book_id: ID, author_id: ID): Iswritten\r\n}\r\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

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