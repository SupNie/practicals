const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Book 
{
  ////The properties
  constructor(book_id, title, author, availability)
  {
    this.book_id = book_id;
    this.title = title;
    this.author = author;
    this.availability = availability;
  }
  //getAllBooks: This method retrieves all book records from the "Books" table using a SELECT * query. It establishes a connection, executes the query, parses the results, and returns an array of Book objects constructed from the retrieved data. Finally, it closes the connection.
  static async getAllBooks() 
  {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Books`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map
    (
      (row) => new Book(row.book_id, row.title, row.author, row.availability)
    ); // Convert rows to Book objects
  }
  //Finds the book by ID, updates its properties with the provided newBookData, and returns the updated book object. If the book is not found, it returns null.
  static async updateBook(id, newBookData)
  {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Books SET title = @title, author = @author, availability = @availability WHERE book_id = @book_id`; // Parameterized query

    const request = connection.request();
    request.input("book_id", book_id);
    request.input("title", newBookData.title || null); // Handle optional fields
    request.input("author", newBookData.author || null);
    request.input("availability", newBookData.availability || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getBookById(book_id); // returning the updated book data
  }

}

////module.exports is a special object that allows you to export values (functions, variables, classes) from your module file to be used in other parts of your application.
module.exports = Book;