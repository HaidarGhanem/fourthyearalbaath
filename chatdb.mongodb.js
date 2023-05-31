
const { ObjectId } = require("mongodb");

const database = 'chatdb';
const collection = 'chat';

// Create a new database.
use(database);

// Create a new collection.
db.createCollection(collection,{
     roomid : ObjectId , //for video call
     groupid : ObjectId, //for group chat
     chatid : ObjectId,  // for singal chat
     userid1 : ObjectId, //the basic user for chat 
     userid2 : ObjectId, // second user for chat
     sender: ObjectId,
     receiver: ObjectId,
     message: String,
     time: Date
});

