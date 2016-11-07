
// Modifier les valeurs

var HOST = process.env.DB_HOST || 'localhost';
var USERNAME = process.env.DB_USER || 'username';
var PASSWORD = process.env.DB_PASS || 'password';
var DB_PORT = process.env.DB_PORT || '5432';
var DB_NAME = process.env.DB_NAME || 'mobytick';


module.exports = {
  
  db_url: 'postgres://'+USERNAME+':'+PASSWORD+'@'+HOST+':'+DB_PORT+'/'+DB_NAME,
}
