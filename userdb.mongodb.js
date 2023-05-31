
const database = 'userdb';
const collection = 'user';

// Create a new database.
use(database);

// Create a new collection.
db.createCollection(collection,{
    userid : ObjectId,
    firstname : String,
    lastname  : String,
    email     : String,
    password  : String,
    phonenumber : Integer
});

