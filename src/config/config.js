process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';
process.env.SENDGRID_API_KEY='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'

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/app-db';
}
else {
	urlDB = 'mongodb+srv://admin:admin@appcluster-4c37k.mongodb.net/app-db?retryWrites=true'

}

process.env.URLDB = urlDB
