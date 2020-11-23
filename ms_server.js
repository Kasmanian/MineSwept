// require('dotenv').config();
// const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fu4ur.mongodb.net/MineSwept?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
//   client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     collection.insertOne({ message: this.message}).then(()=>{
//       console.log('Promise succeeded!');
//       client.close();
//     });
// });