// author_model.js
const db = require("../config/database_connection");
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
    const query = await db.query(
      `FOR author IN authors FILTER author.name LIKE '%${researchQuery}%' OR author.firstName LIKE '%${researchQuery}%' RETURN author`
    );
    return query.all();
  }

  async createAuthor(author) {
    const result = await authorCollection.save(author, { returnNew: true });
    return result.new;
  }

  async updateAuthor(key, updatedata) {
    const newAuthor = await authorCollection.update(key, updatedata, {
      returnNew: true,
    });
    return newAuthor.new;
  }

  async deleteAuthor(key) {
    await authorCollection.remove(key);
    return "ok";
  }
}

module.exports = new AuthorModel();
