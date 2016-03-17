//import express framework
var http    = require("https");
var async   = require("async");
var express = require('express');
var path    = require('path');
var bodyParser = require("body-parser");

var app = express();

//enable bodyparser middleeware
//bodyparser.urlencoded returns middleware that only parses urlencoded bodies
//bodyparser.json returns middleware that only parses json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Render default page
// __dirname is the directory in which the currently executing script resides, 
//in this case getID.js and apiGET.thml are in the same directory
//path.join joins all arguments together and normalizes the resulting path (i.e. it will get rid of unnecessary delimiters..extra slashes and stuff)
app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/SharePoint2.html'));
});

//get nominee ID from user input 
app.use('/nomineeData', function(req,res,next){
	var nomData2 = req.body;
	var nomData = nomData2.nominee
	console.log(nomData);
	
//expose nominee ID
// app.use() for binding middle-ware to application, will respond to any path regardless of HTTP method used (i.e. GET, PUT, POST etc)
// app.get() is application routing specifically for GET requests 
// res.json sends json response, can also use res.send but only res.json will convert non-objects (i.e. null, undefined)

app.get('/nomineeID', function(req, res, next) {
  APIcall("user?q="+nomData, "GET", null, function(response){
    var requestResponse = '';
    response.on('data',function(chunk){
      requestResponse+=chunk;
	  data = JSON.parse(requestResponse);
	  nomineeID = data.content['items'][0]['id'];
	  console.log(nomineeID);
      return(nomineeID);
    })
    response.on('end',function(){
      res.json(nomineeID);
		})
		});
	});

}); 

app.use('/nominatorData', function(req,res,next){
var nominatorData2 = req.body;
var nominatorData = nominatorData2.nominator
console.log(nominatorData);
	
//expose nominator ID
app.get('/nominatorID', function(req,res,next) {
  APIcall("user?q="+nominatorData, "GET", null, function(response){
    var requestResponse = '';
    response.on('data',function(chunk){
      requestResponse+=chunk;
	  data = JSON.parse(requestResponse);
	  nominatorID = data.content['items'][0]['id'];
      return(nominatorID);
    })
    response.on('end',function(){
     res.json(nominatorID);
    })
  });
  });
});

//expose post endpoint
app.post('/recognitionPOST', function(req,res,next){
	var postData = req.body;
	APIcall("recognition", "POST", postData, function(){
		console.log("recognition posted!")
	})
	res.end("Your recognition has been posted!");
}); 
	
//listen to localhost port 3000
app.listen(3000);
console.log('Listening on port 3000...');

//function to call Achievers API
function APIcall(endpoint, method, data, callback) {

  var programURL = "over.sandbox.achievers.com"

    switch(method) {
    case 'GET':
      var options = {
        "method": method,
        "hostname": programURL,
        "path": "/api/v3/" + endpoint,
        "headers": {
          "accept": "application/json",
          "content-type": "application/json",
          "authorization": 'Basic YzQ1MTQ3ZGVlNzI5MzExZWY1YjVjMzAwMzk0NmM0OGY6ZTQ3YjM3ZWQ0MWVmNjFmYTc5OWI5M2RkYzMxZDQzOWM='
        }
      };
      var request = http.request(options,callback)
      request.end();

      break;

    case 'POST':
      var options = {
        "method": method,
        "hostname": programURL,
        "path": "/api/v3/" + endpoint,
        "headers": {
          "accept": "multipart/form-data",
          "content-type": "application/json",
          "authorization": "Basic YzQ1MTQ3ZGVlNzI5MzExZWY1YjVjMzAwMzk0NmM0OGY6ZTQ3YjM3ZWQ0MWVmNjFmYTc5OWI5M2RkYzMxZDQzOWM=",
          "cache-control": "no-cache",
        }
      };
      var request = http.request(options,callback)
      //posts data
      request.write(JSON.stringify(data))
      //end request
      request.end();
      break;

    default:
      console.log("error");
  }
}
