require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

app.use(express.json())

const users = []

let refreshTokens = []

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

app.post('/token', (req, res) => 
{
    const refreshToken = req.body.token
    if (refreshToken == null)
    {
        return res.sendStatus(401)
    }
    if (!refreshTokens.includes(refreshToken))
    {
        return res.sendStatus(403)
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => 
    {
        if (err)
        {
            return res.sendStatus(403)
        }
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

app.delete('/logout', (req, res) => 
{
   refreshTokens = refreshTokens.filter(token => token !== req.body.token)
   res.sendStatus(204)
})


async function login(req, res) 
{
    const { username, password } = req.body;
  
    try 
    {
      // Validate user credentials
      const user = await getUserByUsername(username);
      if (!user) 
      {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare password with hash
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) 
      {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const payload = 
      {
        id: user.id,
        role: user.role,
      };
      const token = jwt.sign(payload, "68ab5038a996ace7e40441638f1cd341bc875e5161e2c47550af7220d6eb8c6361a1f119a72f3e6c7985b5dad689235b17c72788074c9f9727af58e2165a4425", { expiresIn: "3600s" }); // Expires in 1 hour
  
      return res.status(200).json({ token });
    } 
    catch (err) 
    {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

app.listen(4000)

