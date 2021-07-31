const fs = require('fs');
const path = require('path');

function copyFileSync(source, target) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

function createFolder(dir){
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

createFolder('./dist');
createFolder('./dist/icons');
createFolder('./dist/general');
copyFileSync('./schoox/.style.css', './dist/icons/style.css');
copyFolderRecursiveSync('./schoox/fonts/', './dist/icons');
copyFolderRecursiveSync('./images/', './dist');


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
fs.writeFile("./dist/general/icons.json", file, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
