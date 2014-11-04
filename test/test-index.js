/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var assert = require('assert'),
    vows = require('vows'),
    restify = require('../src/index');

vows.describe('architect-restify').addBatch({
    'can create a server listening on an unix socket':  {
        topic: function () {
            restify({
                socket: '/tmp/architect-restify.sock'
            }, {}, this.callback);
        },
        'and retur a valid object': function (err, res) {
            assert.ok(res);
        }
    }
}).exportTo(module);