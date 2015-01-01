#!/usr/bin/env node
var http    = require('http');
var fs      = require('fs');
var url     = require("url");
var process = require('process');
var argv    = require('yargs').argv;
var port    = argv.port || argv.p || 9001;

cors_headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "X-Requested-With",
  "Access-Control-Allow-Headers": "Content-Type"
}

// Hack sanitization job
var folderToServe = process.argv[2] || '.';
if (folderToServe.slice(0, 3) === '-p' || folderToServe.slice(0, 6) === '--port') {
  folderToServe = '.';
}
if (folderToServe[folderToServe.length - 1] != '/') {
  folderToServe += '/';
}
if (folderToServe[0] != '/') {
  folderToServe = process.cwd() + '/' + folderToServe;
}
console.log("Serving HTTP on 0.0.0.0:"  + port + " for directory " + folderToServe);

var main = function(req, res) {
  switch(req.url) {
    case "/favicon.ico" || undefined:
      res.writeHead(200);
      res.end();
      break;
    case "/":
    case "/.json":
      console.log("Serving " + req.url);
      var files;
      try {
        files = fs.readdirSync(folderToServe)
            .map(function(v) {
                return { name:v,
                         time:fs.statSync(folderToServe + v).mtime.getTime()
                       };
             })
             .sort(function(a, b) { return a.time - b.time; })
             .map(function(v) { return v.name; });
        res.writeHead(200, cors_headers);
        res.write(JSON.stringify(files))
      } catch (e) {
        console.log(e);
        res.writeHead(500);
      } finally {
        res.end();
      }
      break;
    default:
      var uri = url.parse(req.url).pathname;
      var path = folderToServe + uri;
      console.log("Serving " + uri);

      fs.readFile(path, "binary", function(err, file) {
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
}

var server = http.createServer(main)
  .on('error', function (e) {
    console.log(e);
    console.log('Unable to start server');
    console.log('Is port ' + port + ' available?');
  }).listen(port);

