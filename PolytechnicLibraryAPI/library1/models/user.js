const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User
{
    //Properties
    constructor(user_id, username, passwordHash, role) 
    {
      this.user_id = user_id;
      this.username = username;
      this.passwordHash = passwordHash;
      this.role = role;
    }

    
}

module.exports = User;