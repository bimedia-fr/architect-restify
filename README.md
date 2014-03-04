architect-restify
=================

expose restify server *rest* as architect plugin. 

### Installation

```sh
npm install --save architect-restify
```

### Usage

Boot [Architect](https://github.com/c9/architect) :

```js
var path = require('path');
var architect = require("architect");

var configPath = path.join(__dirname, "config.js");
var config = architect.loadConfig(configPath);

architect.createApp(config, function (err, app) {
    if (err) {
        throw err;
    }
    console.log("app ready");
});
```

Configure Architect with `config.js` :

```js
module.exports = [{
    packagePath: "architect-restify",
    port: process.env.PORT || 8080,
    host: process.env.IP || "0.0.0.0"
}, './routes'];
```
 
Consume *rest* plugin in your `./routes/package.json` :

```js
{
  "name": "routes",
  "version": "0.0.1",
  "main": "index.js",
  "private": true,

  "plugin": {
    "consumes": ["rest"]
  }
}
```

Eventually register your routes in `./routes/index.js` :

```js
module.exports = function setup(options, imports, register) {
    var rest = imports.rest;

    // register routes 
    rest.get('/catalogue', function (req, res, next) {
        res.write('{'message':'hello, world'}');
	res.end();
    });
    
    register();
};
```
