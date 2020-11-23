
const $form = $('#login-form');
const $message = $('#message');

const site = "http://localhost:3030/"
// const port = process.env.PORT || 3030;
const port =  3030
const website = '' + port
//"http://localhost:3030/"
document.getElementById('1').onclick = function(e) {
    e.preventDefault();
        
        $message.html('');


  //so basically returns input 
        const dat = $form.serializeArray().reduce((o, x) => {
            o[x.name] = x.value;
            //console.log(o)
            return o;
        }, {});
        
    //so this checks with the user.json by pushing the input into it  
    //secrets
        //byid(2)
        //allid()
        //add("feli", "foobar")
        //destroy(2)
        login(dat)
        //edit(1, "foo")
        
    //scores  
        //byidScore(2)
    //can use addscore as editScore
        //addScore("ricky", "hard", 420)
        //allidScore()
        //destroyScore(2)
        //editScore(6, 3000)
          
}

document.getElementById('2').onclick = function(e) {
    e.preventDefault();
        
        $message.html('');
  //so basically returns input 
        const dat = $form.serializeArray().reduce((o, x) => {
            o[x.name] = x.value;
            //console.log(o)
            return o;
        }, {});
        add(dat.user, dat.password)
          
}

$(function() {

    
        

});
 async function byid(id) {
    await axios({
        method: 'get',
        //so this is how we are doing the postman using these urls
        url: website + '/secret/'+id,

    }).then((resp) => {
    //console.log(resp.data)
    return resp.data
    })
 }

 async function edit(id, pass) {
    await axios({
        method: 'put',
        //so this is how we are doing the postman using these urls
        url: website + 'secret/'+id,
        data: {
            pass: pass,
        }

    }).then((resp) => {
    
    return resp.data
    })
 }

async function allid() {
    await axios({
        method: 'get',
        //so this is how we are doing the postman using these urls
        url: website + 'secret',
    }).then((resp) => {
        //console.log(resp.data)
return resp.data
    })
 
}

async function add(name, password) {
    await axios({
        method: 'post',

        url: website + 'secret',
        
        data: {
            name: name,
            pass: password,
        }

    }).then((resp) => {
    return resp.data
    })
 }

 async function destroy(id) {
    await axios({
        method: 'delete',

        url:  website + 'secret/' + id,

    }).then((resp) => {
        return resp.data
    })
 }

 async function login(dat) {
    //console.log(dat.user, dat.password)

    await axios({
        method: 'post',

        url: website +  'login',
        
        data: {
            name: dat.user,
            pass: dat.password,
        }
    }).then(() => {
            $message.html('<span class="has-text-success">Success! You are now logged in.</span>');

            window.location.replace("/index.html");
            
        }).catch(() => {
            
            $message.html('<span class="has-text-danger">Something went wrong and you were not logged in. Check your name and password and your internet connection.</span>');
        
             
        });
 }

// Turn the data object into an array of URL-encoded key/value pairs.

 async function byidScore(id) {
    await axios({
        method: 'get',
        //so this is how we are doing the postman using these urls
        url:  website +  'score/'+id,

    }).then((resp) => {
    //console.log(resp.data.name)
    //console.log(resp.data)
    return resp.data
    })
 }

 async function editScore(id, score) {
    await axios({
        method: 'put',
        //so this is how we are doing the postman using these urls
        url: website + 'score/'+id,
        data: {
            score: score,
        }

    }).then((resp) => {
    
    return resp.data
    })
 }

async function allidScore() {
    await axios({
        method: 'get',
        //so this is how we are doing the postman using these urls
        url: website + 'score',
    }).then((resp) => {
        //console.log(resp.data)
return resp.data
    })
 
}

async function addScore(name, mode, score) {
    await axios({
        method: 'post',

        url: website + 'score',
        
        data: {
            name: name,
            mode: mode,
            high_score: score,
        }

    }).then((resp) => {
    return resp.data
    })
 }

 async function destroyScore(id) {
    await axios({
        method: 'delete',

        url: website + 'score/' + id,
        

    }).then((resp) => {
        return resp.data
    })
 }

//  host: ec2-54-147-126-202.compute-1.amazonaws.com
//  database: dda16farqg62o2
//  user: qbfmetnhedgwns
//  port: 5432
//  password: d431dfd950d0ff136eca88d21a4c0ede3de2470d0c3fce67d5faf2dea7f775a2
//  uri: postgres://qbfmetnhedgwns:d431dfd950d0ff136eca88d21a4c0ede3de2470d0c3fce67d5faf2dea7f775a2@ec2-54-147-126-202.compute-1.amazonaws.com:5432/dda16farqg62o2