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
      bookController.getBookByAuthor(author_id),
    //booksAuthor: (_, { book_id }) => authorController.getBookAuthor(book_id),
  },

  Mutation: {
    //author
    createAuthor: (_, { name, firstName }) =>
      authorController.createAuthor(name, firstName),
    updateAuthor: (_, { key, name, firstName }) =>
      authorController.updateAuthor(key, name, firstName),
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
