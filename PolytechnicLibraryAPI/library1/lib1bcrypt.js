require('dotenv').config()

const express = require('express')
const booksController = require("./controllers/booksController");
const usersController = require("./controllers/usersController");

const sql = require("mssql");
const dbConfig = require("./dbConfigMember");
const dbConfigs = require("./dbConfigLibrarian");

const app = express();
const port = process.env.PORT || 3000;

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

app.use(express.json())

app.get("/books", booksController.getAllBooks); ///books: This route maps to the getAllBooks function in the booksController. Upon receiving a GET request to this route, the controller function will be invoked to retrieve all book records.
app.put("/books/:bookId/availability", validateBook, booksController.updateBook); // Add validateBook before updateBook

app.post("/users", usersController.createUser); // Create user

const users = []

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]

app.get('/users', (req,res) => {
  res.json(users)
})

app.post('/users', async (req,res) => {
  try
  {
    const hashedPassword = await hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send()
  }  
  catch
  {
    res.status(500).send()
  }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name)
    if (user == null)
    {
        return res.status(400).send('Cannot find user')
    }
    try
    {
        if (await compare(req.body.password, user.password))
        {
            res.send('Success')
        }
        else
        {
            res.send('Not Allowed')
        }
    }
    catch
    {
        res.status(500).send()
    }
})

app.get('/posts', authenticateToken, (req, res) => 
{
    res.json(posts.filter(post => post.username === req.user.name))
})


function verifyJWT(req, res, next) 
{
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) 
  {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "68ab5038a996ace7e40441638f1cd341bc875e5161e2c47550af7220d6eb8c6361a1f119a72f3e6c7985b5dad689235b17c72788074c9f9727af58e2165a4425", (err, decoded) => 
  {
    if (err)
    {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Check user role for authorization (replace with your logic)
    const authorizedRoles = 
    {
      "/books": ["member", "librarian"], // Anyone can view books
      "/books/[0-9]+/availability": ["librarian"], // Only librarians can update availability
    };

    const requestedEndpoint = req.url;
    const userRole = decoded.role;

    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => 
      {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(userRole);
      }
    );

    if (!authorizedRole) 
    {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}



app.listen(port, async () => 
{
  try 
  {
    // Connect to the database
    await sql.connect(dbConfig);
    await sql.connect(dbConfigs);
    console.log("Database connection established successfully");
  } 
  catch (err) 
  {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => 
{
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});



