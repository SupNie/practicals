const User = require("../models/user");

const bcrypt = require("bcryptjs");

async function registerUser(req, res) 
{
  const { username, password, role } = req.body;

  try 
  {
    // Validate user data
    // ... your validation logic here ...

    // Check for existing username
    const existingUser = await getUserByUsername(username);
    if (existingUser) 
    {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const createUser = async (req, res) => 
    {
            //Extract user data from the request body.
        const newUser = req.body;
        try 
        {
              //Call the User.createUser method to save the new user.
            const createdUser = await User.createUser(newUser);
              //Upon successful creation, return a success response with the created user data.
            res.status(201).json(createdUser);
        } 
            //Handle potential errors during user creation and return appropriate error responses.
        catch (error) 
        {
            console.error(error);
            res.status(500).send("Error creating user");
        }
    };
    // ... your database logic here ...

    return res.status(201).json({ message: "User created successfully" });
  } 
  catch (err) 
  {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = 
{
    registerUser,
    createUser,
};