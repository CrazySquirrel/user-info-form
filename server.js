"use strict";

const FS = require("fs");
const PATH = require("path");
const NET = require('net');
const HTTP = require("http");
const SPDY = require("spdy");
const EXPRESS = require("express");
const COOKIE_PARSER = require("cookie-parser");
const BODY_PARSER = require("body-parser");
const COMPRESSION = require("compression");

const MAX_AGE = 1000 * 60 * 60 * 24 * 365;

const APP = EXPRESS();

/**
 * Compressing
 */
APP.use(COMPRESSION());

/**
 * Cookie processor
 */
APP.use(COOKIE_PARSER());

/**
 * Parsers for POST data
 */
APP.use(BODY_PARSER.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000
}));

APP.use(BODY_PARSER.json({
  limit: "50mb"
}));

/**
 * Point static path to dist
 */
APP.use(
    EXPRESS.static(PATH.resolve(__dirname, 'build'), {
      etag: true,
      maxAge: MAX_AGE
    })
);

/**
 * Catch all other routes and return the index file
 */
APP.get("*", (req, res) => {
  res.sendFile(PATH.resolve(__dirname, 'build', 'index.html'));
});

/**
 * Get port from environment and store in Express.
 */
APP.set("port", 7000);

NET.createServer((conn) => {
  conn.once('data', (buf) => {
    const proxy = NET.createConnection(
        (buf[0] === 22) ? 7002 : 7001,
        () => {
          proxy.write(buf);
          conn.pipe(proxy).pipe(conn);
        }
    );
  });
}).listen(7000);

HTTP.createServer((req, res) => {
  var host = req.headers['host'];
  res.writeHead(301, {"Location": "https://" + host + req.url});
  res.end();
}).listen(7001);

SPDY.createServer({
  key: FS.readFileSync("ssl/server.key"),
  cert: FS.readFileSync("ssl/server.crt"),
}, APP).listen(7002);