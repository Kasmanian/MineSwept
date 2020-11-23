//this calls secret functions

const express = require('express');
var cors = require('cors')
const app = express();
let port = process.env.PORT || 3030;
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const expressSession = require('express-session');
//creates cookie
app.use(expressSession({
    name: "kmpSessionCookie",
    secret: "express session secret",
    resave: false,
    saveUninitialized: false
}));

const Secret = require("./Secret.js").Secret;
const Score = require("./Secret.js").Score;
const login_data = require('data-store')({ path: process.cwd() + '/data/secrets.json' });
//this checks users
app.post('/login', (req,res) => {
    //console.log("hiiiiii")
    //by name get id
    let name = req.body.name;
    id = null
    
    Secret.getAllIDs().forEach(ele => {
        //console.log(ele)
        if (ele != undefined ){
            if(Secret.findByID(ele.toString()).name == name) {
                //console.log(Secret.findByID(ele.toString()))
                id= Secret.findByID(ele.toString()).id
                
            }
        }
       
    });
    
    if (id == null) {
        //console.log("its null")
        res.status(404).send("Username does not exist");
        return;
    }
    let pass = req.body.pass;
    let user_data = login_data.get(id.toString());
   // console.log(user_data)

    //console.log(user_data.pass, pass)
    if (user_data.pass == pass) {
        //console.log("User " + user + " credentials valid");

        //console.log(user)
        res.json(true);
        return;
    }
    res.status(403).send("Unauthorized");
});


app.get('/secret', (req, res) => {
    
    res.json(Secret.getAllIDs())

     return;
});
//find certain account
app.get('/secret/:id', (req, res) => {

    let s = Secret.findByID(req.params.id);
    if (s == null) {
        res.status(404).send("Not found");
        return;
    }



    res.json(s);
} );
//post are done via postman

app.post('/secret', (req, res)=> {
    //same name
    Secret.getAllIDs().forEach(ele => {
        
        if (ele != undefined ){
            if(Secret.findByID(ele.toString()).name == name) {
                //console.log(Secret.findByID(ele.toString()))
                res.status(400).send("Bad Request");
                return;
                
            }
        }
       
    });
    let s = Secret.create(req.body.name, req.body.pass);
    //console.log(s)
    if (s == null) {
        res.status(400).send("Bad Request");
        return;
    }
    return res.json(s);
});
//edit account
app.put('/secret/:id', (req, res) => {

    let s = Secret.findByID(req.params.id);
    if (s == null) {
        res.status(404).send("Not found");
        return;
    }
    //console.log(req.body.pass.toString())
    s.update(req.body.pass);
    res.json(s.id);
});

app.delete('/secret/:id', (req, res) => {

    let s = Secret.findByID(req.params.id);
    if (s == null) {
        res.status(404).send("Not found");
        return;
    }
    s.delete();
    res.json(true);
})




//heroku makes its own portnum cant hardcode

app.listen(port, () => {
    console.log("User Login Example up and running on port " + port);
});







const score_data = require('data-store')({ path: process.cwd() + '/data/scores.json' });

//this checks users

app.get('/score', (req, res) => {
    res.json(Score.getAllIDs2())

     return;
});
//find certain account
app.get('/score/:id', (req, res) => {

    let s = Score.findByID2(req.params.id);
    if (s == null) {
        res.status(404).send("Not found");
        return;
    }



    res.json(s);
} );
//add new

app.post('/score', (req, res)=> {
    //if already exist 
    var exist = null
    Score.getAllIDs2().forEach(ele => {
        
        if (ele != undefined ){
            if(Score.findByID2(ele.toString()).name == req.body.name) {
                
                if(Score.findByID2(ele.toString()).mode == req.body.mode) {
                
                    exist = Score.findByID2(ele.toString())
                    
                }
                
            }
        }
       
    });

    if (exist != null) {
        exist.update2(req.body.high_score);
        return res.json(exist);
    }


    let s = Score.create2(req.body.name, req.body.mode, req.body.high_score,);
    //console.log(s)
    if (s == null) {
        res.status(400).send("Bad Request");
        return;
    }


    return res.json(s);
});
//edit score
app.put('/score/:id', (req, res) => {

    let s = Score.findByID2(req.params.id);
    if (s == null) {
        res.status(404).send("Not found");
        return;
    }
    //console.log(req.body.pass)
    s.update2(req.body.score);
    res.json(s.id);
});

app.delete('/score/:id', (req, res) => {

    let s = Score.findByID2(req.params.id);
    if (s == null) {
        res.status(404).send("Not found");
        return;
    }
    s.delete2();
    res.json(true);
})

