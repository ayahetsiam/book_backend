// resolvers.js
const authorController = require("../controllers/author_controller");
const bookController = require("../controllers/book_controller");

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

    authorsBooks: (_, { author_id }) =>
      bookController.getBooksByAuthor(author_id),
    booksAuthor: (_, { book_id }) => authorController.getBookAuthor(book_id),

    bookisbn: (_, { isbn }) =>
      require("../models/book_model").default.getBookByISBN(isbn),
  },

  Mutation: {
    //author
    createAuthor: (_, { nom, prenom }) =>
      authorController.createAuthor(nom, prenom),
    updateAuthor: (_, { key, nom, prenom }) =>
      authorController.updateAuthor(key, nom, prenom),
    deleteAuthor: (_, { key }) => authorController.deleteAuthor(key),

    //book
    createBook: (_, { isbn, title, oeuvre, page, author_id }) =>
      bookController.createBook(isbn, title, oeuvre, page, author_id),
    updateBook: (_, { key, title, oeuvre, page }) =>
      bookController.updateBook(key, title, oeuvre, page),
    deleteBook: (_, { key }) => bookController.deleteBook(key),
  },
};

export default resolvers;
