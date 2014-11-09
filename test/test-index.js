/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var assert = require('assert');
var vows = require('vows');
var restify = require('../lib/index');

vows.describe('architect-restify').addBatch({
    'can create a server listening on an unix socket':  {
        topic: function () {
            restify({
                socket: '/tmp/architect-restify.sock'
            }, {}, this.callback);
        },
        'and return a valid object': function (err, res) {
            assert.ok(res);
            assert.isObject(res);
        }
    }
}).exportTo(module);
