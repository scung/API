//call API call function to get nominator and nominee IDs then post recognition
function postReco() {
//Get nominator ID
api_call('user?q=sylvia.cung', 'GET', null, function(response)
{
 var obj = response.content;
 var item = obj.items[0];
 var nominatorID = (item.id); 
	//Get nominee ID
	api_call('user?q=amanda.leung', 'GET',null,function(response)
	{
	var obj = response.content;
	var item = obj.items[0];
	var nomineeID = (item.id);
		//Post recognition
		var recognitionPost = api_call('recognition', 'POST',  JSON.stringify({"criterionId" : "14346", "from" : nominatorID, "to" : nomineeID,  "recognitionText": "test"}), 
		function(){
		alert('Your recognition has been posted');
		});
    //console.log(JSON.stringify({"criterionId" : "14346", "from" : nominatorID, "to" : nomineeID,  "recognitionText": "test"}));
    //console.log(typeof nomineeID);
	//console.log(typeof nominatorID);
	//console.log(nomineeID);
    //console.log(nominatorID);
	}); 
});

};



function getUserID(endpoint, requestType, postData, callback){
var http = require("https");
var programURL = "over.sandbox.achievers.com/api/v3/"

switch(requestType) {

case: "GET":
var options = {
  "method": requestType,
  "hostname": programURL,
  "port": null,
  "path": endpoint,
  "headers": {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": "Basic YzQ1MTQ3ZGVlNzI5MzExZWY1YjVjMzAwMzk0NmM0OGY6ZTQ3YjM3ZWQ0MWVmNjFmYTc5OWI5M2RkYzMxZDQzOWM=",
    "cache-control": "no-cache",
	sucess: callback
  }
};

var req = http.request(options, function (res) {
  var chunks = [];
  res.on("data", function (chunk) {
    chunks.push(chunk);
  });
  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();

break;

case: "POST":
var options = {
  "method": requestType,
  "hostname": programURL,
  "port": null,
  "path": "/api/v3/recognition",
  "headers": {
    "authorization": "Basic YzQ1MTQ3ZGVlNzI5MzExZWY1YjVjMzAwMzk0NmM0OGY6ZTQ3YjM3ZWQ0MWVmNjFmYTc5OWI5M2RkYzMxZDQzOWM=",
    "accept": "multipart/form-data",
    "content-type": "application/json",
    "cache-control": "no-cache",
	success: callback
  }
};

var req = http.request(options, function (res) {
  var chunks = [];
  res.on("data", function (chunk) {
    chunks.push(chunk);
  });
  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(postData);
req.end();

}

}

