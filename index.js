/*
Initialization, where I do initalization stuffs.
*/
console.log("Starting initialization");
let initTime = 0;

//let discordInit = false;
let banchoInit;
let serverInit;

let initInterval = setInterval(ms, 1);
function ms () {
    return ++initTime;
}
function checkInitProgress() {
    if (banchoInit == true && serverInit == true) {
        clearInterval(initInterval);
        console.log("Initialization complete, finished in " + initTime + "ms");
    } else {
        console.log("Init next..");
    }
}
//Discord shit
/*const Discord = require("discord.js");
console.log("Discord Lib found!");
const discordClient = new Discord.Client();
client.on("ready", () => {
    discordInit = true;
    console.log("discordInit = " + discordInit + " >> Discord Client Ready");
    checkInitProgress();
});*/

//Bancho shit
const Banchojs = require("bancho.js");
console.log("Bancho Lib found!");
const banchoClient = new Banchojs.BanchoClient(require("bancho.js/config.json"));
console.log("Bancho User Config found!");

//HTTP Server shit
let request = require('request');
let http = require("http");
let fs = require("fs");
let port = 3000;

let token = 0;
let userID = 0;

banchoClient.connect().then(() => {
    banchoInit = true;
    console.log("banchoInit = " + banchoInit + " >> Bancho Client Succesfully Connected");
    checkInitProgress();
}).catch(console.error);

/*function verifySuccess() {
    setTimeout(() => {
        console.log("It all worked out fine in the end.");
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");

        const responseBody = { headers, method, url, body };

        response.write(JSON.stringify(responseBody));
        response.end();
    }, 1000);
}

function banchoSendToken(token) {
    banchoClient.getUserById(userID).then(function (user) {
        //user.sendMessage("This is an automated message!");
        user.sendMessage("This is an automated message! Please input the token sent below into the CMP website:");
        console.log("Token is: " + token);
        user.sendMessage(token.toString());
        console.log("Token recieved and sent to user: " + user);
        userID = 0;
        token = 0;
        verifySuccess();
    }).catch(function (err) {
        console.log("Something went wrong in \"banchoSendToken\" when attempting to message user!");
        console.log(err);
    });
    //banchoClient.disconnect();
}*/

function req (request, response) {

    const { headers, method, url } = request;
    
    if (request.method === 'POST' && request.url === '/osuverify') {
        console.log("################### OSU VERIFY POST REQUEST DETECTED ###################");
        let chunkNumber = 0;
        let body = [];
        let sharedSecret = 1;
        request.on('error', (err) => {
            console.error(err);
        })
        .on('data', (chunk) => {
            body.push(chunk);
        })
        .on('end', () => {
            ++chunkNumber;
            body = Buffer.concat(body).toString();
            console.log("Chunk number: " + chunkNumber + " >> Current body data = " + " \" " + body + " \" ");
        });

        response.on('error', (err) => {
           console.error(err);
        });

        setTimeout(() => {
            let parsedBody = JSON.parse(body);
            
            console.log("Final body data: " + parsedBody.sharedSecret + ", " + parsedBody.osuToken + ", " + parsedBody.osuId + ".");
            if (parsedBody.sharedSecret == 0 || parsedBody.osuToken == 0 || parsedBody.osuId == 0) {
                console.log("ERROR >> Package corrupted or invalid.");
                response.statusCode = 404;
                response.end();
            } else if (parsedBody.sharedSecret == null || parsedBody.osuToken == null || parsedBody.osuId == null) {
                console.log("ERROR >> Package corrupted or invalid.");
                response.statusCode = 404;
                response.end();
            } else {
                if (sharedSecret == parsedBody.sharedSecret) {
                    //If the shared secret is true, after "body[]" has been parsed and before response fires, I want to trigger banchoSendToken.
                    function verifySuccess() {
                        setTimeout(() => {
                            console.log("It all worked out fine in the end.");
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json");

                            const responseBody = { headers, method, url, body };

                            response.write(JSON.stringify(responseBody));
                            response.end();
                        }, 1000);
                    }

                    function banchoSendToken(token) {
                        banchoClient.getUserById(userID).then(function (user) {
                            //user.sendMessage("This is an automated message!");
                            user.sendMessage("This is an automated message! Please input the token sent below into the CMP website:");
                            console.log("Token is: " + token);
                            user.sendMessage(token.toString());
                            console.log("Token recieved and sent to user: " + user);
                            userID = 0;
                            token = 0;
                            verifySuccess();
                        }).catch(function (err) {
                            console.log("Something went wrong in \"banchoSendToken\" when attempting to message user!");
                            console.log(err);
                        });
                        //banchoClient.disconnect();
                    }

                    token = parsedBody.osuToken;
                    userID = parsedBody.osuId;

                    try {
                        banchoSendToken(token);
                    } catch(err) {
                        console.log("Something went wrong in the \"request respond function\" when attempting to fire \"banchoSendToken\"!");
                        console.log(err);
                        //errorFound = true;
                        response.statusCode = 404;
                        response.end();
                    }

                    /*setTimeout(() => {
                        if (errorFound == false) {
                            console.log("It all worked out fine in the end.");
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json");

                            const responseBody = { headers, method, url, body };

                            response.write(JSON.stringify(responseBody));
                            response.end();
                        }
                    }, 1000);*/
                } else {
                    console.log("DETECTED ATTEMPTED POST REQUEST WITH INVALID SECRET.");
                    response.statusCode = 404;
                    response.end();
                }
            }
        }, 800);
    } else {
        response.statusCode = 404;
        response.end();
    }
}

console.log("Starting server...");
let server = http.createServer(req).listen(port);
serverInit = true;
console.log("serverInit = " + serverInit + " >> Server running, listening to port \"" + port + "\"");
checkInitProgress();
/*
End of Initialization.
*/