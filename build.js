/* global require */

var fs = require("fs");
var browserify = require("browserify");

function write (inputPath, outputPath) {
    
    var file = fs.createWriteStream(outputPath);
    var bundle = browserify(inputPath).bundle();
    
    bundle.pipe(file);
}

write("index.js", "build/transform.js");
write("global.js", "build/transform-global.js");
