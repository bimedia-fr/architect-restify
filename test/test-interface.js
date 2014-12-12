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
var iface = require('../lib/interfaces');

var listening;

var server = {
    listen : function (port, host) {
        listening = host;
    }
};

vows.describe('interface listener').addBatch({
    'can make a server listening on specific interface':  {
        topic: function () {
            iface.listen(server, { 'interface' : 'lo', port : 8080 }, this.callback);
        },
        'and return a valid object': function (err, res) {
            assert.ok(res);
            console.log('listening ' + listening);
            assert.equal(listening, '127.0.0.1');
        }
    }
}).exportTo(module);
