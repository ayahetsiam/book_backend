const db = require("../config/database_connection");
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
    const query = await db.query(
      `FOR w IN iswritten FILTER w._from == ${id} RETURN w`
    );
    return await query.all(); // Si aucun résultat, la relation est unique
  }

  async researchWritten(query) {
    const writtens = this.getWrittens();
    return (await writtens).filter(
      (w) =>
        w.author.nom.includes(query) ||
        w.author.prenom.includes(query) ||
        w.book.title.includes(query) ||
        w.book.oeuvre.includes(query)
    );
  }

  async createWritten(book_id, author_id, date) {
    const insertion = await writtenCollection.save({
      _from: book_id,
      _to: author_id,
      writtenAt: date,
    });
    const newwritten = await writtenCollection.edges(insertion._key);
    return newwritten;
  }

  async createWritten(isdn, title, oeuvre) {
    const written = { ISDN: isdn, title: title, oeuvre: oeuvre };
    const insertion = await writtenCollection.save(written);
    const newWritten = await writtenCollection.document(insertion._key);
    return newWritten;
  }

  async updateWritten(key, title, oeuvre) {
    const update = await writtenCollection.update(
      key,
      { title: title, oeuvre: oeuvre },
      { returnNew: true }
    );
    return update.new;
  }

  async deleteWritten(key) {
    await writtenCollection.remove(key);
    return "ok";
  }

  async checkByAuthor(author) {
    const query = await db.query(
      `FOR w IN written FILTER w._to == ${author._id} RETURN w`
    );
    return await query.all();
  }

  async checkByBook(book) {
    const query = await db.query(
      `FOR w IN iswritten FILTER w._from == ${book._id} RETURN w`
    );
    return await query.all(); // Si aucun résultat, la relation est unique
  }
}

module.exports = new WrittenModel();
