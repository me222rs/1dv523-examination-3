/*jshint esversion: 6 */
//Sets the environment variable as early as possible
require('dotenv').config();

//Node modules
const express       = require("express");
const hbs           = require("express-handlebars");
const bodyParser    = require("body-parser");
const path          = require("path");
const GithubWebHook = require('express-github-webhook');
const octonode      = require("octonode");
const fs            = require('fs');
const escape        = require('escape-html');

var app = express();

// Works with https also
//var http = require("http");
var https = require("https");
var port = process.env.PORT || 3000;

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Start the server
var server = https.createServer({
  key: fs.readFileSync("./config/sslcerts/key.pem"),
  cert: fs.readFileSync("./config/sslcerts/cert.pem")
}, app).listen(port, function() {
    console.log("Express started on https://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});
//Create websocket server
var io = require("socket.io")(server);

//Seems to be no need for secret atm which seems a little strange...?
//The webhook runs on /webhook and not on the root
var github = GithubWebHook({path: '/webhook', secret: process.env.GITHUB_TOKEN});
app.set('socket.io', io); //Saves the socket.io so i can get it in other files
app.set('github', github);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Use this when localhost
//app.use('/static', express.static(path.join(__dirname, '/public')));
app.use(github);

//Routes
app.use("/", require("./routes/home.js"));
app.use("/webhook", require("./routes/payload.js"));

    io.on('connection', function (socket) {
        //Issues
        github.on('issues', function (repo, data) {
          //The application listens to when an issue is opened, closed or reopened
          if(data.action === 'opened' || data.action === 'reopened'){

            socket.emit('issue', { action: data.action, title: escape(data.issue.title), body: escape(data.issue.body), url: data.issue.html_url, issueNumber: data.issue.number });
            socket.emit('issueList', { title: escape(data.issue.title), body: escape(data.issue.body), url: data.issue.html_url, user: data.issue.user.login, issueNumber: data.issue.number });
          }
          if(data.action === 'closed'){
            socket.emit('issue', { action: data.action, title: escape(data.issue.title), body: escape(data.issue.body), url: data.issue.html_url, issueNumber: data.issue.number });
          }
        });
        //Comments
        github.on('issue_comment', function (repo, data) {
          console.log("Issue commented!");
          socket.emit('issueComment', { action: data.action, body: data.comment.body, url: data.comment.html_url, user: data.comment.user.login, issueNumber: data.issue.number });
        });
    });
