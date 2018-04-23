//HTTP Server shit
let request = require('request');
let http = require("http");
let fs = require("fs");
let port = 3001;

/*
 * Okoratu: 1623405 
 * 
 * Halfslashed: 4598899
 * 
 * Arnyxa: 3408126
 * 
 * Naxess: 8129817
*/

function postOsuVerify() {
    request.post(
        'http://localhost:3000/osuverify',
        { json: { sharedSecret: 1, osuToken: 2, osuId: 3408126 } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    );
}
function req (request, response) {
    //const { headers, method, url } = request;
    postOsuVerify();
    
}

console.log("Request server starting...");
let server = http.createServer(req).listen(port);
serverInit = true;
console.log("Request server running, listening to port \"" + port + "\"");