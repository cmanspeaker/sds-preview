// load fs
const fs = require("fs");
// read the file
var content = (fs.readFileSync("./schoox/style.css")).toString();
// print it

var find = '.schoox-';
var re = new RegExp(find, 'g');

content = content.replace(re, '.cl-');

var find = '.schoox {';
var re = new RegExp(find, 'g');

content = content.replace(re, '.cl {');

fs.writeFile("./schoox/cl-icons-font.css", content, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
