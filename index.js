console.log("Starting initialization...");

let initTime = 0;
let initInterval = setInterval(() => {
    return ++initTime;
}, 1);

// Discord
/*const Discord = require("discord.js");
console.log("Discord Lib found!");
const discordClient = new Discord.Client();
client.on("ready", () => {
    discordInit = true;
    console.log("discordInit = " + discordInit + " >> Discord Client Ready");
    CheckInitProgress();
});*/

// Bancho
const banchojs = require("bancho.js");
console.log("Bancho Library found!");

const banchoClient = new banchojs.BanchoClient(require("bancho.js/config.json"));
console.log("Bancho User Config found!");

// Server
let http = require("http");
let fs = require("fs");
let port = 3000;

let token = 0;
let userID = 0;

let server;

// Connection
ConnectToBancho();

function ConnectToBancho() {
    console.log("Connecting to bancho...");
    banchoClient.connect().then(() => {
        console.log("Bancho client succesfully connected.");

        ConnectToServer();
    });
}

function ConnectToServer() {
    console.log("Starting server...");
    server = http.createServer(Request).listen(port);
    console.log("Server running, listening to port \"" + port + "\".");

    clearInterval(initInterval);
    console.log("Initialization complete, finished in " + initTime + "ms.");
}

// Global Server Variables
let body = [];
let chunkNumber;
const sharedSecret = 1;

function Request(request, response) {
    const { headers, method, url } = request;

    if (request.method === 'POST' && request.url === '/osuverify') {
        console.log("################### OSU VERIFY POST REQUEST DETECTED ###################");

        body = [];

        InitializeRequest(request, response);
    }
    else {
        response.statusCode = 404;
        response.end();
    }
}

function InitializeRequest(request, response) {
    chunkNumber = 0;

    response.on('error', (err) => {
        console.error(err);
    });

    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        ++chunkNumber;
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log("Chunk number: " + chunkNumber + " >> Current body data = " + " \" " + body + " \" ");

        // Handle when everything is sent
        HandlePackages(body, request, response);
    });
}

function HandlePackages(body, request, response) {
    let parsedBody = JSON.parse(body);

    console.log("Final body data: " + parsedBody.sharedSecret + ", " + parsedBody.osuToken + ", " + parsedBody.osuId + ".");
    if (parsedBody.sharedSecret == 0 || parsedBody.osuToken == 0 || parsedBody.osuId == 0
        || parsedBody.sharedSecret == null || parsedBody.osuToken == null || parsedBody.osuId == null) {
        console.log("ERROR >> Package corrupted or invalid.");
        response.statusCode = 404;
        response.end();
    }
    else {
        CheckSecret(body, parsedBody, request, response);
    }
}

function CheckSecret(body, parsedBody, request, response) {
    if (sharedSecret == parsedBody.sharedSecret) {
        token = parsedBody.osuToken;
        userID = parsedBody.osuId;

        try {
            BanchoSendToken(body, request, response);
        }
        catch (err) {
            console.log("Something went wrong in the \"request respond function\" when attempting to fire \"BanchoSendToken\"!");
            console.log(err);

            response.statusCode = 404;
            response.end();
        }
    }
    else {
        console.log("DETECTED ATTEMPTED POST REQUEST WITH INVALID SECRET.");
        response.statusCode = 404;
        response.end();
    }
}

function BanchoSendToken(body, request, response) {
    banchoClient.getUserById(userID).then((user) => {
        console.log("Token is: " + token);

        user.sendMessage("This is an automated message! Please input the token sent below into the CMP website:");
        user.sendMessage(token.toString());

        console.log("Token recieved and sent to user: " + user);
        VerifySuccess(body, request, response);
    }).catch((err) => {
        console.log("Something went wrong in \"BanchoSendToken\" when attempting to message user!");
        console.log(err);
    });
}

function VerifySuccess(body, request, response) {
    const { headers, method, url } = request;
    
    console.log("It all worked out fine in the end.");

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");

    const responseBody = { headers, method, url, body };
    response.write(JSON.stringify(responseBody));
    response.end();
}