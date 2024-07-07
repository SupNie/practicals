module.exports = 
{
    user: "member", // Replace with your SQL Server login username
    password: "password", // Replace with your SQL Server login password
    server: "localhost",
    database: "library_db",
    trustServerCertificate: true,
    options: 
    {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
};