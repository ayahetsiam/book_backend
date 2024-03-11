// resolvers.js
const authorModel = require("../models/author_model");

const resolvers = {
  Query: {
    authors: () => authorModel.getAuthors(),
    author: (_, { id }) => authorModel.getAuthorById(id),
    researchAuthor: (_, { query }) => authorModel.researchAuthor(query),
  },
  Mutation: {
    createAuthor: (_, { nom, prenom }) => authorModel.createAuthor(nom, prenom),
    //updateAuthor: (_, { id, nom, prenom }) =>
    //authorModel.updateAuthor(id, nom, prenom),
    //deleteAuthor: (_, { id }) => authorModel.deleteAuthor(id),
  },
};

export default resolvers;
