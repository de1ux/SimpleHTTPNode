SimpleHTTPNode
==============

Inspired by python's SimpleHTTPNode server.

There are a few ways to invoke the server
```bash
$ node server.js  # exposes the cwd on port 9001
$ node server.js path/to/folder --port 8080
$ node server.js -p 8080
```

This server lists files at the level specified and does not recurse. For example, if you run this in directory /foo, /foo/bat.txt and /foo/bar.sh can be accessed, but not /foo/ding/bat.sh or /foo/ding/ling/bar.txt. 

It's worth noting that CORS headers are returned in every request and the directory listing will always return files by datetime.
