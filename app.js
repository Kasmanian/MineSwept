const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

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
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.fu4ur.mongodb.net/MineSwept?retryWrites=true&w=majority`;

var client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

app.post('/login', async (req, res)=> {
    client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    if (!validateUSER(req.body.name)|!validatePASS(req.body.pass)) {
        res.status(400).send('Username must be between 6 and 12 characters long. Password must be at least 6 characters long. Use standard chracters.'); return;
    }
    await client.connect().then(()=> {
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
            client.close();
        });
    });
});

app.post('/signup', async (req, res)=> {
    if (!validateUSER(req.body.name)|!validatePASS(req.body.pass)) {
        res.status(400).send('Username must be between 6 and 12 characters long. Password must be at least 6 characters long. Use standard chracters.'); return;
    }
    client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    await client.connect().then(()=> {
        const collection = client.db("MineSweptGames").collection("users");
        let text = req.body.name.split('#');
        let name = text[0];
        let etag = text[1] || '';
        let hash = crypto.createHash('sha256');
        let pass = hash.update(req.body.pass+'mscavesv1').digest('hex');
        let fail = false;
        collection.find({ name: name }).forEach((doc)=> {
            if (doc.name==name) {
                fail = true; return;
            }
        }).then(()=> {
            if (fail) {
                res.status(400).send("Username already exists.");
                client.close();
            } else {
                res.status(200).send("Account created.");
                collection.insertOne({ name: name, etag: etag, pass: pass}).then(()=> {
                    client.close();
                });
            }
        });
    });
});

app.delete('/destroy', async (req, res)=> {
    client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    await client.connect().then(()=> {
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
            if (fail) {
                res.status(400).send("Username  does not exist or password is incorrect.");
                client.close();
            } else {
                res.status(200).send("Account Deleted.");
                collection.deleteOne({ name: name, pass: pass}).then(()=> {
                    client.close();
                });
            }
        });
    });
});

app.get('/score', async (req, res)=> {
    client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    await client.connect().then(()=> {
        const collection = client.db("MineSweptGames").collection("scores");
        let easy = []; let norm = []; let hard = [];
        collection.find({ mode: 'easy' }).sort({ score: -1 }).limit(3).forEach((doc)=> {
            easy.push(doc);
        }).then(()=> {
            collection.find({ mode: 'norm' }).sort({ score: -1 }).limit(3).forEach((doc)=> {
                norm.push(doc);
            }).then(()=> {
                collection.find({ mode: 'hard' }).sort({ score: -1 }).limit(3).forEach((doc)=> {
                    hard.push(doc);
                }).then(()=> {
                    res.send({ easy: easy, norm: norm, hard: hard });
                    client.close();
                });
            });
        });
    });
});

app.post('/finish', async (req, res)=> {
    client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    await client.connect().then(()=> {
        const collection = client.db("MineSweptGames").collection("scores");
        let name = req.body.name;
        let mode = req.body.mode;
        let score = req.body.score;
        if (score == undefined) return;
        collection.updateOne({ name: name, mode: mode }, { '$max': { score: score } }, { upsert: true }).then(()=> {
        }).then(()=> {
            res.status(200).send("Score recorded");
            client.close();
        });
    });
});

app.listen(PORT, () => {
    console.log("User Login Example up and running on port " + PORT);
});

const validateUSER = function(input) {
    if (!input.match(/^[0-9a-zA-Z#_]+$/)|input.length<4|input.lastIndexOf('#')!=input.indexOf('#')|input.length>12) return false;
    return true;
}

const validatePASS = function(input) {
    if (!input.match(/^[0-9a-zA-Z!@]+$/)|input.length<5) return false;
    return true;
}