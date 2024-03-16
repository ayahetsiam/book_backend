// resolvers.js
const authorController = require("../controllers/author_controller");
const bookController = require("../controllers/book_controller");
const writtenController = require("../controllers/written_controller");

const resolvers = {
  Query: {
    //author
    authors: () => authorController.getAuthors(),
    author: (_, { key }) => authorController.getAuthorByKey(key),
    researchAuthor: (_, { query }) => authorController.researchAuthor(query),

    //book
    books: () => bookController.getBooks(),
    book: (_, { key }) => bookController.getBookByKey(key),
    researchBook: (_, { query }) => bookController.researchBook(query),

    //writting book relation
    bookWritten: () => writtenController.getWrittens(),
    book: (_, { key }) => bookController.getBookByKey(key),
    researchBook: (_, { query }) => bookController.researchBook(query),
    //bookbyid: (_, { book, author }) => writtenController.isCorrect(book, author),
  },
  Mutation: {
    //author
    createAuthor: (_, { nom, prenom }) =>
      authorController.createAuthor(nom, prenom),
    updateAuthor: (_, { key, nom, prenom }) =>
      authorController.updateAuthor(key, nom, prenom),
    deleteAuthor: (_, { key }) => authorController.deleteAuthor(key),

    //book
    createBook: (_, { isbn, title, oeuvre }) =>
      bookController.createBook(isbn, title, oeuvre),
    updateBook: (_, { key, title, oeuvre }) =>
      bookController.updateBook(key, title, oeuvre),
    deleteBook: (_, { key }) => bookController.deleteBook(key),

    //relation between them:writtenBy
    createWritten: (_, { book, author }) =>
      writtenController.createWritten(book, author),
  },
};

export default resolvers;
