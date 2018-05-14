/*jshint esversion: 6 */
const router = require("express").Router();
const express       = require("express");
const octonode      = require("octonode");

var client          = octonode.client(process.env.GITHUB_TOKEN);
var ghrepo          = client.repo('1dv523/me222rs-examination-3'); //Name of github repo

router.route("/")
    .get((req, res) => {
      ghrepo.issues(function(callback, body, header){
        //I can get the io like this
        var io = req.app.get('socket.io');
        res.render("webhook/webhook", {issues: body});
      });

    });

module.exports = router;
