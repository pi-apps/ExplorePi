var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/console-log.txt', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
require('./lib/block')
require('./lib/database')
require('./lib/effect')
require('./lib/operation')
require('./lib/transaction')