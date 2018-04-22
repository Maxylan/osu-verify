/*
Initialization, where I do initalization stuffs.
*/
console.log("Starting initialization");
let initTime = 0;
let initInterval = setInterval(ms, 1);
function ms () {
    initTime++;
}

//Discord shit
/*const Discord = require("discord.js");
console.log("Discord Lib found!");
const discordClient = new Discord.Client();
client.on("ready", () => {
    console.log("Discord Client Ready");
});*/

//Bancho shit
const Banchojs = require("bancho.js");
console.log("Bancho Lib found!");
const banchoClient = new Banchojs.BanchoClient(require("bancho.js/config.json"));
console.log("Bancho Config found!");

//HTTP Server shit
let http = require(http);
let fs = require("fs");
let port = 3000;

let token;
let userID = 0;

banchoClient.connect().then(() => {
}).catch(console.error);
function banchoSendToken(token) {
    banchoClient.connect().then(() => {
        let user = new getUserById(userID);
        sendMessage("This is an automated message!");
	    sendMessage("Please input the token sent below into the CMP website:");
        sendMessage(token);
        console.log("Token generated and sent to: " + user);
        userID = 0;
    	banchoClient.disconnect();
    }).catch(console.error);
}

function req (request, response) {

    const { headers, method, url } = request;
    
    if (request.method === 'POST' && request.url === '/osuverify') {
        let body = [];
        request.on('error', (err) => {
            console.error(err);
        })
        .on('data', (chunk) => {
            body.push(chunk);
        })
        .on('end', () => {
            body = Buffer.concat(body).toString();
        });

        response.on('error', (err) => {
           console.error(err);
        });
        //If the shared secret is true, after "body[]" has been parsed and before response fires, I want to trigger banchoSendToken.
        banchoSendToken(user, token);

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');

        const responseBody = { headers, method, url, body };

        response.write(JSON.stringify(responseBody));
        response.end();
    } else {
        response.statusCode = 404;
        response.end();
    }
}

clearInterval(initInterval);
console.log("Initialization complete, finished in " + initTime);

/*
End of Initialization.
*/

console.log("Starting server...");
let server = http.createServer(req).listen(port);
console.log("Server running, listening to port " + port);

