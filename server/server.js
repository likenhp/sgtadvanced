

const express = require("express");//load the express library into the file

const server = express();

server.use( express.static( __dirname + "/html" /* this is a path */) );

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




server.listen(3001, ()=>{
    //console.log("server is runnning on port 3001");
    console.log("carrier has arrived");
    //the program will continue listening, it needs to be stopped by using "ctrl+c"
})
//you want the server to listen for a connection
//where am I setting up
//what function am I going to run after I know where I am (callback function)
//it only does listening and nothing else right now