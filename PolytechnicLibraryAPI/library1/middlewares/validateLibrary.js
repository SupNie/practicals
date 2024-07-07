const jwt = require("jsonwebtoken");

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