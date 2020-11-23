const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var PORT = process.env.PORT || 3030;
var favicon = require('serve-favicon');
var PATH = require('path');

var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.use(favicon(PATH.join(__dirname, 'public', 'favicon.ico')))

app.use(express.static('login'));

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://KasManian:3p6qmMbuAR7V4is@cluster0.fu4ur.mongodb.net/MineSwept?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  client.connect(err => {
});

app.post('/login', (req, res)=> {
    const collection = client.db("MineSweptGames").collection("users");
    let name = req.body.name;
    let pass = req.body.pass;
    let fail = true;
    collection.find({ name: name }).forEach((doc)=> {
        console.log(doc)
        if (doc.pass==pass) {
            fail = false;
            return;
        }
    }).then(()=> {
        if(!fail) {
            res.status(200).send("Logged in: "+name);
             window.localStorage.PORT = PORT;
        } else res.status(403).send("Unauthorized");
    });
});

app.post('/signup', (req, res)=> {
    const collection = client.db("MineSweptGames").collection("users");
    let name = req.body.name;
    let pass = req.body.pass;
    let fail = false;
    collection.find({}).forEach((doc)=> {
        console.log(doc.name+": "+name);
        console.log(doc.name==name);
        if (doc.name==name) {
            fail = true; return;
        }
    }).then(()=> {
        console.log(fail);
        fail? res.status(400).send("Username already exists") : collection.insertOne({ name: name, pass: pass});
        fail? undefined : res.status(200).send("Account created");
    });
});

app.get('/score', (req, res)=> {
    const collection = client.db("MineSweptGames").collection("scores");
    let easy = []; let norm = []; let hard = [];
    collection.find({ mode: 'easy' }).limit(3).sort( { score: -1 }).forEach((doc)=> {
        easy.unshift(doc);
    }).then(()=> {
        collection.find({ mode: 'norm' }).limit(3).sort( { score: -1 }).forEach((doc)=> {
            norm.unshift(doc);
        }).then(()=> {
            collection.find({ mode: 'hard' }).limit(3).sort( { score: -1 }).forEach((doc)=> {
                hard.unshift(doc);
            }).then(()=> {
                res.send({ easy: easy, norm: norm, hard: hard });
            });
        });
    });
});

app.post('/finish', (req, res)=> {
    const collection = client.db("MineSweptGames").collection("scores");
    let name = req.body.name;
    let mode = req.body.mode;
    let score = req.body.score;
    if (score == undefined) return;
    collection.updateOne({ name: name, mode: mode, score: { $lt: score } }, { $set: { name: name, mode: mode, score: score } }).then(()=> {
    });
    res.status(200).send("Score recorded");
});

app.listen(PORT, () => {
    console.log("User Login Example up and running on port " + PORT);
});