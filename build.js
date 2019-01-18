const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

const read = file => fs.readFileSync(path.join(__dirname,file),'utf-8')

const template = read('src/template.ejs')
const loader = read('src/loader.js')

const bookmarklets = [{
    title:'Quiz Save/Load',
    name:'quizsaver',
    url:'https://byui.instructure.com/files/6572492/download',
}]

console.log(bookmarklets.map(b => b.src=encodeURIComponent(
    `${loader}("${b.name}","${b.url}",function(){window.${b.name}.default()})`
)))

fs.writeFileSync(path.join(__dirname,'README.md'),ejs.render(template,{loader,bookmarklets}))