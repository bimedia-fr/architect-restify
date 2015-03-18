/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
/* 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

var assert = require('assert');
var vows = require('vows');
var restify = require('../lib/index');
var http = require('http');

var count = 0;
var PORT;

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
}).addBatch({
    'can create a server listening on a random port':  {
        topic: function () {
            PORT = restify({
                port: 0,
                plugins: {
                    myPlugin: function () {
                        return function (req, res, next) {
                            count++;
                            next();
                        };
                    }
                }
            }, {}, this.callback).address().port;
        },
        'and return a valid object': function (err, rest) {
            assert.isObject(rest);
        },
        'and test server': {
            topic: function () {
                http.request('http://localhost:' + PORT, function (err, res) {
                    assert.equal(count, 1);
                });
            },
            teardown: function (server) {
                server.close(function () {
                    console.log('server closed');
                });

            }
        }
    }
}).exportTo(module);
