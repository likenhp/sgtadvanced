

const express = require("express");//load the express library into the file
const mysql = require("mysql");//load the mysql library into the file
const mysqlcredentials = require("./mysqlcreds.js");//the ./ is necessary, since linux needs it to look into the current folder

const db = mysql.createConnection(mysqlcredentials);//mysql connect to the database, use the creds to establish the connection

const server = express();

server.use( express.static( __dirname + "/html" /* this is a path */) );
//looking in the html forlder for a file called index.html
//__dirname is your current working directory, in this case the server directory
//the .static means nothing will change, the file it targets will not change until someone changes it (i.e. index.html)


server.listen(3001, ()=>{
    //console.log("server is runnning on port 3001");
    console.log("carrier has arrived");
    //the program will continue listening, it needs to be stopped by using "ctrl+c"
})
//you want the server to listen for a connection
//where am I setting up
//what function am I going to run after I know where I am (callback function)
//it only does listening and nothing else right now

server.get("/api/grades", (req, resp)=>{
    resp.send(`{
        "success": true,
        "data": [{
            "id": 7,
            "name": "Joe Rossi",
            "course": "Highlander",
            "grade": 2
        }, {
            "id": 9,
            "name": "Westley Poon",npm
            "course": "Highloser",
            "grade": 1
        }, {
            "id": 31,
            "name": "David Lee",
            "course": "Walrus",
            "grade": 56
        }]
    }`)
})
//th /api means nothing, all the endpoints will be in a path of api to make it easy to locat a specific group






/*
const insults = [
    "your father smelt of elderberries",
    "I heard you took an arrow to the knee",
    "Had it not been for the laws of this land, I would have slaughtered you!",
]
    //the url/path to listen for
    //the callback function to call once that path has been received
server.get("/", function(request, response){
    //this function will receive 2 things
    //an object representing all of the data coming from the client to the server (request/req)
    //an object representing all of the data going from the server to the client (response/resp)
    response.send("Hello, World.")
})

server.get("/time", (request, response)=>{
    var now = new Date();
    response.send(now.toLocaleDateString());
})

server.get("/insult", (request,response)=>{
    response.send(insults[Math.floor(Math.random()*insults.length)]);
})
*/