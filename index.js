'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const
    request = require('request'),
    express = require('express'),
    body_parser = require('body-parser'),
    app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.use(express.static("public"))

// app.get('/', (req, res, next) => {
//     //res.send("<h1>Hello World!</h1>");
//     res.sendFile('/public/', { root: __dirname });
//     // let referer = req.get('Referer');
//     // if (referer) {
//     //     if (referer.indexOf('www.messenger.com') >= 0) {
//     //         res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
//     //     } else if (referer.indexOf('www.facebook.com') >= 0) {
//     //         res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
//     //     }
//     //     res.sendFile('public/index.html', { root: __dirname });
//     // }
// });

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {
    // Parse the request body from the POST
    let body = req.body;
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender ID: ' + sender_psid);
            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });
        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
    /** UPDATE YOUR VERIFY TOKEN **/
    const VERIFY_TOKEN = "BOTELSALVADOR";
    // Parse params from the webhook verification request
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    // Check if a token and mode were sent
    if (mode && token) {
        // Check the mode and token sent are correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Respond with 200 OK and challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

function handleMessage(sender_psid, received_message) {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }
    // Send the response message
    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
    console.log('ok')
    let response;
    // Get the payload for the postback
    let payload = received_postback.payload;
    // Set the response based on the postback payload
    if (payload === 'start_chat') {
        callSendAPI(sender_psid, { "text": "La COVID-19 es una enfermedad que proviene de una familia extensa de virus; los coronavirus." });
        sleep(200);
        callSendAPI(sender_psid, { "text": "Este auto-test es una guía pero no sustituye un diagnóstico profesional.\n\n¡Comencemos!" });
        sleep(400);
        callSendAPI(sender_psid, { "text": "¿En qué municipio vives actualmente?" });
        sleep(600);
        callSendAPI(sender_psid, {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "¿Listo para el auto-test?",
                    "buttons": [
                        {
                            "type": "web_url",
                            "url": "https://bot-el-salvador.herokuapp.com",
                            "webview_height_ratio": "compact",
                            "messenger_extensions": true,
                            "title": "🌡️ Empezar auto-test"
                        },
                    ]
                }
            }
        }
        );
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }

    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}



function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}