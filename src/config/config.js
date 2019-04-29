process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB

if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/app-db';
	process.env.URLDB = urlDB
}


const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  URLDB: process.env.URLDB,
  APIKEY: process.env.APIKEY,
  PORT: process.env.PORT
};
