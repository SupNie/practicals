const Book = require("../models/book");

//getAllBooks: This function utilizes the Book.getAllBooks method to retrieve all books. It catches potential errors and sends appropriate error responses to the client.
const getAllBooks = async (req, res) => 
{
  try 
  {
    const books = await Book.getAllBooks();
    res.json(books);
  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).send("Error retrieving books");
  }
};

//Handles PUT /books/id HTTP method in the app.js to update the book by providing the id
const updateBook = async (req, res) => 
{
    const bookId = parseInt(req.params.id);
    const newBookData = req.body;
    
    try 
    {
       const updatedBook = await Book.updateBook(bookId, newBookData);
       if (!updatedBook) 
       {
          return res.status(404).send("Book not found");
       }
       res.json(updatedBook);
    } 
    catch (error) 
    {
       console.error(error);
       res.status(500).send("Error updating book");
    }
};
    

////module.exports is a special object that allows you to export values (functions, variables, classes) from your module file to be used in other parts of your application.
module.exports = 
{
    getAllBooks,
    updateBook,
};