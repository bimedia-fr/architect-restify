architect-restify
=================

expose restify server *rest* as architect plugin. 

### Installation

```sh
npm install --save architect-restify
```
### Config Format 

```js
{
  "packagePath": "architect-restify",
  port: process.env.PORT || 8080,
  host: process.env.IP || "0.0.0.0"
}
```

Or With plugins :

```js
{
  packagePath: "architect-restify",
  port: process.env.PORT || 8080,
  host: process.env.IP || "0.0.0.0"
  plugins: {
    CORS:  {
      origins: ['http://localhost:8080']
    }
  }
}
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
 
And register your routes in `./routes/index.js` :

```js
module.exports = function setup(options, imports, register) {
    var rest = imports.rest;

    // register routes 
    rest.get('/catalogue', function (req, res, next) {
        res.write("{'message':'hello, world'}");
	res.end();
    });
    
    register();
};
// Consume rest plugin
module.exports.consumes=['rest'];
```

### Options
* port : tcp port to listent to
* host : host to listen to
* socket: unix socket to listen
* interface : network interface name to listen to (must match `os.networkInterfaces`)
* family : interface address family to listen to (with `interface`)
* plugins: a hash containing either a [restify bundled plugin](http://mcavage.me/node-restify/#Bundled-Plugins) or a function that returns a plugin.