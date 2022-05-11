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
createFolder('./dist/sds');
createFolder('./dist/icons');
createFolder('./dist/general');
createFolder('./dist/css');
copyFileSync('./schoox/.style.css', './dist/icons/style.css');
// fs.unlinkSync('./schoox/.style.css');
copyFolderRecursiveSync('./schoox/fonts/', './dist/icons');
copyFolderRecursiveSync('./images/', './dist');
copyFolderRecursiveSync('./schoox/', './dist/general');
copyFolderRecursiveSync('./design-system/build', './dist/sds');
copyFileSync('./design-system/main.css', './dist/css/main.css');
copyFileSync('./design-system/main.min.css', './dist/css/main.min.css');
copyFileSync('./design-system/tokens.json', './dist/sds/tokens.json');
fs.unlinkSync('./design-system/main.css');
fs.unlinkSync('./design-system/main.min.css');




// read the file
var content = (fs.readFileSync("./schoox/.style.css")).toString();

const regex = /\.schoox-(.*?):before\{content:\"(.*?)\"}/gm;
let m;
let icons = [];
let iconsContent = [];
let iconsContent_iOS = [];
let iconsContent_android = [];

while ((m = regex.exec(content)) !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    icons.push(m[1]);
    iconsContent.push({id: m[1], code: '&#x'+m[2].substring(1)});
}
let file = `{
    "icons": ${JSON.stringify(icons)}
}
`
let fileWithContent = `{
    "icons": ${JSON.stringify(iconsContent)}
}
`
fs.writeFile("./dist/general/icons.json", file, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
fs.writeFile("./dist/general/icons-content.json", fileWithContent, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
