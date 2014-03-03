/**
 * Created by Alexey Ostrovsky.
 * Date: 27.02.14
 * Time: 14:23
 */

var fs = require('fs');
var xml2js = require('xml2js');
var builder = new xml2js.Builder();
var parseString = xml2js.parseString;
var inspect = require('eyes').inspector({maxLength: false});

var INPUT_DIR = 'svg/';
var OUTPUT_DIR = 'sprite/';
var OUTPUT_SPRITE_FILENAME = 'sprite.svg';
var SVG_EXTENSION = '.svg';

// initial position of each icon in the sprite
var x = 0, y = 0;

// the resulting sprite object
var sprite = {
    svg: {
        svg: [],
        $: { xmlns: 'http://www.w3.org/2000/svg' }
    }
};

/*
* Get file extension from string in format ".ext"
* */
function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

// get list of files in a given directory
fs.readdir(INPUT_DIR , function(err, files){
    var filesLeft = files.length;

    files.forEach(function(filename) {

        // check if file has proper extension
        if (getExtension(filename).toLowerCase() == SVG_EXTENSION) {
            fs.readFile(INPUT_DIR + filename, 'utf8', function (err, fileContent) {
                if (err) {
                    return console.log(err);
                }

                filesLeft--;

                parseString(fileContent, function (err, parsedFileContent) {
                    var iconHeight = parseInt(parsedFileContent.svg.$.height);

                    // add icon under the previous
                    parsedFileContent.svg.$.y = y;
                    y += iconHeight;

                    // add current icon object to resulting sprite object
                    sprite.svg.svg.push(parsedFileContent);

                    // when all files have been processed
                    if(!filesLeft) {
                        // build xml from resulting sprite object
                        var resultSprite = builder.buildObject(sprite);


                        fs.writeFile(OUTPUT_DIR + OUTPUT_SPRITE_FILENAME, resultSprite, function(err) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log("The sprite was successfully saved to " + OUTPUT_DIR + OUTPUT_SPRITE_FILENAME);
                            }
                        });
                    }
                });
            });
        } else {
            filesLeft--;
        }
    });
});