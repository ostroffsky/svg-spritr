/**
 * Created by Alexey Ostrovsky.
 * Date: 27.02.14
 * Time: 14:23
 */

var fs = require('fs');
var parseString = require('xml2js').parseString;

var INPUT_DIR = 'svg/';
var SVG_EXTENSION = '.svg';

/*
* Get file extension from string in format ".ext"
* */
function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

// get list of files in a given directory
fs.readdir(INPUT_DIR , function(err, files){
    files.forEach(function(filename) {

        // check if file has proper extension
        if (getExtension(filename).toLowerCase() == SVG_EXTENSION) {

            fs.readFile(INPUT_DIR + filename, 'utf8', function (err, fileContent) {
                if (err) {
                    return console.log(err);
                }

                parseString(fileContent, function (err, result) {
                    console.dir(result);
                });
            });
        }
    });
});