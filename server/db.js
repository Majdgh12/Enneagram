const sql = require('mssql');

const config = {
    user: 'enneagramUser',      
    password: 'majdghoche1',     
    server: 'DESKTOP-V94SQS8\\SQLEXPRESS', 
    database: 'enneagram',      
    port: 1433,                 
    options: {
        encrypt: true,           // Use this if you're on Windows Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.log('Database Connection Failed - ', err);
        throw err;  // Propagate the error
    });

module.exports = {
    sql,
    poolPromise
};
