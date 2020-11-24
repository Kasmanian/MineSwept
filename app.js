const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// var PORT = process.env.PORT || 3030;
var PORT = process.env.PORT;
if (PORT == null || PORT == '') {
  PORT = 8000;
}

var favicon = require('serve-favicon');
var crypto = require('crypto');
var PATH = require('path');

var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.use(favicon(PATH.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static('login'));

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://KasManian:3p6qmMbuAR7V4is@cluster0.fu4ur.mongodb.net/MineSwept?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

app.post('/login', async (req, res)=> {
    if (!validate(req.body.name)|!validate(req.body.pass)) {
        res.status(400).send('Something went wrong and you were not logged in. Username and password must be at least 6 non-special characters.'); return;
    }
    await client.connect();
    const collection = client.db("MineSweptGames").collection("users");
    let name = req.body.name;
    let hash = crypto.createHash('sha256');
    let pass = hash.update(req.body.pass+'mscavesv1').digest('hex');
    let fail = true;
    collection.find({ name: name }).forEach((doc)=> {
        if (doc.pass==pass) {
            fail = false;
            return;
        }
    }).then(()=> {
        if(!fail) {
            res.status(200).send('Logged in: '+name);
        } else res.status(403).send('Something went wrong and you were not logged in. Check your name and password and your internet connection.');
    });
});

app.post('/signup', async (req, res)=> {
    if (!validate(req.body.name)|!validate(req.body.pass)) {
        res.status(400).send('Something went wrong and you were not registered. Username and password must be at least 6 non-special characters.'); return;
    }
    await client.connect();
    const collection = client.db("MineSweptGames").collection("users");
    let name = req.body.name;
    let hash = crypto.createHash('sha256');
    let pass = hash.update(req.body.pass+'mscavesv1').digest('hex');
    let fail = false;
    collection.find({}).forEach((doc)=> {
        if (doc.name==name) {
            fail = true; return;
        }
    }).then(()=> {
        fail? res.status(400).send("Username already exists.") : collection.insertOne({ name: name, pass: pass});
        fail? undefined : res.status(200).send("Account created.");
    });
});

app.delete('/destroy', async (req, res)=> {
    await client.connect();
    const collection = client.db("MineSweptGames").collection("users");
    let name = req.body.name;
    let hash = crypto.createHash('sha256');
    let pass = hash.update(req.body.pass+'mscavesv1').digest('hex');
    let fail = true;
    collection.find({ name: name, pass: pass }).forEach((doc)=> {
        if (doc.name==name&doc.pass==pass) {
            fail = false;
        }
    }).then(()=> {
        fail?  res.status(400).send("Username  does not exist or password is incorrect.") : collection.deleteOne({ name: name, pass: pass});
        fail?  undefined : res.status(200).send("Account Deleted.");
    });
});

app.get('/score', async (req, res)=> {
    await client.connect();
    const collection = client.db("MineSweptGames").collection("scores");
    let easy = []; let norm = []; let hard = [];
    collection.find({ mode: 'easy' }).limit(3).sort( { score: 1 }).forEach((doc)=> {
        easy.unshift(doc);
    }).then(()=> {
        collection.find({ mode: 'norm' }).limit(3).sort( { score: 1 }).forEach((doc)=> {
            norm.unshift(doc);
        }).then(()=> {
            collection.find({ mode: 'hard' }).limit(3).sort( { score: 1 }).forEach((doc)=> {
                hard.unshift(doc);
            }).then(()=> {
                res.send({ easy: easy, norm: norm, hard: hard });
            });
        });
    });
});

app.post('/finish', async (req, res)=> {
    await client.connect();
    const collection = client.db("MineSweptGames").collection("scores");
    let name = req.body.name;
    let mode = req.body.mode;
    let score = req.body.score;
    if (score == undefined) return;
    collection.updateOne({ name: name, mode: mode }, { '$max': { score: score } }, { upsert: true }).then(()=> {
    });
    res.status(200).send("Score recorded");
});

app.listen(PORT, () => {
    console.log("User Login Example up and running on port " + PORT);
});

const validate = function(input) {
    if (!input.match(/^[0-9a-zA-Z#]+$/)|input.length<5|input.lastIndexOf('#')!=input.indexOf('#')) return false;
    return true;
}