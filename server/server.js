

const express = require("express");//load the express library into the file
const mysql = require("mysql");//1st load the mysql library into the file
const mysqlcredentials = require("./mysqlcreds.js");//2nd load, the ./ is necessary, since linux needs it to look into the current folder

const db = mysql.createConnection(mysqlcredentials);//3rd, mysql connect to the database, use the creds to establish the connection

const server = express();

server.use( express.static( __dirname + "/html" /* this is a path */) );
//server.use is the in-between, the middleman
//looking in the html folder for a file called index.html
//__dirname is your current working directory, in this case the server directory
//the .static means nothing will change, the file it targets will not change until someone changes it (i.e. index.html)

server.use(express.urlencoded( {extended: false} ) );
//hey express on any request coming in, go into the body
//if you can find urlencoded data, pull it out and put it into an object for me
//have express pull body data that is urlencoded and place it into an object called "body"



//4th make an endpoint to handle retrieeving grades of all students
server.get("/api/grades", (req, resp)=>{
    //5th establish connection to the database and call the callback function when connection is made
    db.connect( ()=>{
        const queryGrades = 'SELECT `id`, CONCAT (`givenname`, " ", `surname`) AS `name`, `course`, `grade` FROM `grades`';
        //6th create a query for our desired operation
        db.query( queryGrades, (error, data )=>{
            //7th send query to the database, and call the given callback function once the data is retrieved or an error happens
            //8th if error is null no error occured
            //9th create an output object to be sent back to the client
            const output = {
                "success": false,
            }
            //10th if error is null, send the data
            if(!error){
                //11th notify the client that we are sucessful
                output.success = true;
                output.data = data;
                //12th//attach the data from the database to the output object
            } else{
                //13th an error occurred, attach that error 
                output.error = error;
            }

            resp.send( output ); 
            //14th send the data back to the client

            //data will be auto detect whether it is a string or something else and convert to json
        } )
            //will pass in 3 params, error (will be null if no error)
            //second is all of the data
            //third one gives info of all the fields retrieved (we don't care about this)
    }) 
    //will instantiate a direct connect, takes a callback function once the connection is made
})
//the /api means nothing, all the endpoints will be in a path of api to make it easy to locat a specific group

//SELECT is for reading
//INSERT is for adding

//2 methods to insert
//method1, can only insert 1 at a time = INSERT INTO `grades` SET `surname` = "Li", `givenname` = "Ken", `course` = "LF", `grade` = 80, `added` = NOW()
//method2, can insert many = INSERT INTO `grades`(`surname`, `givenname`, `course`, `grade`) 
    //VALUES ("Li", "Ken", "LF", 80), ("Yata", "Jason", "LF", 80)

server.post("/api/grades", (request, response)=>{
    // check the body object and see if any data was not sent
    if(request.body.name === undefined || request.body.course === undefined || request.body.grade === undefined){
        //respond to the client with an appropriate error message
        response.send({
            "success": false,
            error: "invalid course, name, or grade"
        });
        //returns nothing to the server since the server is calling the function
        //exits the functions and will not continue bbelow
        return;
    }

    //connect to the database
    db.connect(()=>{
        //request is the client sending info to the server
        //the body is the payload of the POST message
        //then targetting the name and splitting the spaces in the string into array elements
        const name = request.body.name.split(" ");
        //making a MySQL query by concatinating a string
        const query = 'INSERT INTO `grades` SET `surname` = "'+name.slice(1).join(" ")+'", `givenname` = "'+name[0]+'", `course` = "'+request.body.course+'", `grade` = '+request.body.grade+', `added` = NOW()';
                                                                    //the .slice will make a copy of the name array from poision 1 to the end of the array
        //console.log(query); this is node's console, so it is in the terminal (GitBash)
        
        //db.query is calling the query function
        //the database will then execute the callback function when the database is reay
        db.query(query, (error, results)=>{
            if(!error){
                //if no error client will get a success response
                response.send({
                    "success": true,
                    "new_id": results.insertId
                    //this targets the auto incrememnting field, can only have one auto incrementing field
                    //in this case insertId would target the students id since it is the only object that auto increments
                })
            }else{
                //if there is an error, the client will get an response
                response.send({
                    "success": false,
                    error //works due to ES6 structuring
                })
            }
        })
        
    })
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

//when the server receives a call from that url at that port, 
//then call that function (db.connect)
//connect iff that address is requested























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