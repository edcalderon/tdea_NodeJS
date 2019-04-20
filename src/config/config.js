process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/app-db';
}
else {
	urlDB = 'mongodb+srv://admin:admin@appcluster-4c37k.mongodb.net/app-db?retryWrites=true'

}

process.env.URLDB = urlDB
