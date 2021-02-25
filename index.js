// load fs
const fs = require("fs");
fs.renameSync('./schoox/.style.css', './schoox/style.css', function(err) {
    if ( err ) console.log('ERROR: ' + err);
});
// read the file
var content = (fs.readFileSync("./schoox/style.css")).toString();

var find = /\.schoox/gm;
var content = content.replace(find, '.cl');

fs.writeFile("./schoox/cl-icons-font.css", content, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
