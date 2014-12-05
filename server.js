#!/usr/bin/env node

var http    = require("http");
var fs      = require("graceful-fs");
var process = require("process");
var path    = require("path");
var url     = require("url");
var port    = process.argv[2] || 9001;
var absFolderPath = process.cwd()
console.log("Serving directory " + absFolderPath + " on port " + port);

cors_headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "X-Requested-With",
  "Access-Control-Allow-Headers": "Content-Type"
}

http.createServer(function (req, res) {
  switch(req.url) {
    case "/favicon.ico":
      res.writeHead(200);
      res.end();
      break;
    case "/":
    case "/.json":
      fs.readdir(absFolderPath, function(err, files) {
        try {
          if(err) {
            console.log(err);
            res.writeHead(500);
          } else {
            console.log(files);
            res.writeHead(200, cors_headers);
            res.write(JSON.stringify(files))
          }
        } finally {
          res.end();
        }
      });
      break;
    default:
      var uri = url.parse(req.url).pathname;
      var url = absFolderPath + uri;
      console.log("Serving " + uri);

      fs.exists(url, function(exists) {
        if (!exists) {
          res.writeHead(404, {"Content-Type": "text/plain"});
          res.write("404 Not Found\n");
          res.end();
          return;
        }
      });

      fs.readFile(url, "binary", function(err, file) {
        if(err) {
          res.writeHead(500, {"Content-Type": "text/plain"});
          res.write(err + "\n");
          res.end();
          return;
        }

        res.writeHead(200, cors_headers);
        res.write(file, "binary");
        res.end();
      });
  }
}).listen(port);
