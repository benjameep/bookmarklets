const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

const read = file => fs.readFileSync(path.join(__dirname,file),'utf-8')

const template = read('src/template.ejs')
const loader = read('src/loader.js')

const bookmarklets = [{
    name:'quizsaver',
    url:'https://byui.instructure.com/files/6526704/download',
}]

fs.writeFileSync(path.join(__dirname,'README.md'),ejs.render(template,{loader,bookmarklets}))