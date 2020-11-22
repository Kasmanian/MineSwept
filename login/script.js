
// const $form = $('#login-form');
// const $message = $('#message');
// const website = "http://localhost:3030/"
// $(function() {

    
//     $form.submit(function(e) {
//         e.preventDefault();
  
//         $message.html('');


//   //so basically returns input 
//         const dat = $form.serializeArray().reduce((o, x) => {
//             o[x.name] = x.value;
//             //console.log(o)
//             return o;
//         }, {});
//     //so this checks with the user.json by pushing the input into it  
//     //secrets
//         //byid(2)
//         //allid()
//         //add("feli", "foobar")
//         //destroy(2)
//         //login(dat)
//         //edit(1, "foo")
        
//     //scores  
//         //byidScore(2)
//     //can use addscore as editScore
//         //addScore("ricky", "hard", 420)
//         //allidScore()
//         //destroyScore(2)
//         //editScore(6, 3000)
//     });

// });
//  async function byid(id) {
//     await axios({
//         method: 'get',
//         //so this is how we are doing the postman using these urls
//         url: website + '/secret/'+id,

//     }).then((resp) => {
//     //console.log(resp.data)
//     return resp.data
//     })
//  }

//  async function edit(id, pass) {
//     await axios({
//         method: 'put',
//         //so this is how we are doing the postman using these urls
//         url: website + 'secret/'+id,
//         data: {
//             pass: pass,
//         }

//     }).then((resp) => {
    
//     return resp.data
//     })
//  }

// async function allid() {
//     await axios({
//         method: 'get',
//         //so this is how we are doing the postman using these urls
//         url: website + 'secret',
//     }).then((resp) => {
//         //console.log(resp.data)
// return resp.data
//     })
 
// }

// async function add(name, password) {
//     await axios({
//         method: 'post',

//         url: website + 'secret',
        
//         data: {
//             name: name,
//             pass: password,
//         }

//     }).then((resp) => {
//     return resp.data
//     })
//  }

//  async function destroy(id) {
//     await axios({
//         method: 'delete',

//         url:  website + 'secret/' + id,

//     }).then((resp) => {
//         return resp.data
//     })
//  }

//  async function login(dat) {
//     //console.log(dat.user, dat.password)

//     await axios({
//         method: 'post',

//         url: website +  'login',
        
//         data: {
//             name: dat.user,
//             pass: dat.password,
//         }
//     }).then(() => {
//             $message.html('<span class="has-text-success">Success! You are now logged in.</span>');

//             //window.location.replace("/index.html");
            
//         }).catch(() => {
            
//             $message.html('<span class="has-text-danger">Something went wrong and you were not logged in. Check your name and password and your internet connection.</span>');
        
             
//         });
//  }

// // Turn the data object into an array of URL-encoded key/value pairs.

//  async function byidScore(id) {
//     await axios({
//         method: 'get',
//         //so this is how we are doing the postman using these urls
//         url:  website +  'score/'+id,

//     }).then((resp) => {
//     //console.log(resp.data.name)
//     //console.log(resp.data)
//     return resp.data
//     })
//  }

//  async function editScore(id, score) {
//     await axios({
//         method: 'put',
//         //so this is how we are doing the postman using these urls
//         url: website + 'score/'+id,
//         data: {
//             score: score,
//         }

//     }).then((resp) => {
    
//     return resp.data
//     })
//  }

// async function allidScore() {
//     await axios({
//         method: 'get',
//         //so this is how we are doing the postman using these urls
//         url: website + 'score',
//     }).then((resp) => {
//         //console.log(resp.data)
// return resp.data
//     })
 
// }

// async function addScore(name, mode, score) {
//     await axios({
//         method: 'post',

//         url: website + 'score',
        
//         data: {
//             name: name,
//             mode: mode,
//             high_score: score,
//         }

//     }).then((resp) => {
//     return resp.data
//     })
//  }

//  async function destroyScore(id) {
//     await axios({
//         method: 'delete',

//         url: website + 'score/' + id,
        

//     }).then((resp) => {
//         return resp.data
//     })
//  }

