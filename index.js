// load fs
const fs = require("fs");
fs.renameSync('./schoox/.style.css', './schoox/style.css', function(err) {
    if ( err ) console.log('ERROR: ' + err);
});
// read the file
var content = (fs.readFileSync("./schoox/style.css")).toString();

const regex = /\.schoox-(.*?):/gm;
let m;
let icons = [];

while ((m = regex.exec(content)) !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    icons.push(m[1]);
}
let file = `{
    "icons": ${JSON.stringify(icons)}
}
`
fs.writeFile("./schoox/icons.json", file, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

// var find = /\.schoox/gm;
// var content = content.replace(find, '.cl');
//
// fs.writeFile("./schoox/cl-icons-font.css", content, function(err) {
//     if(err) {
//         return console.log(err);
//     }
//     console.log("The file was saved!");
// });
