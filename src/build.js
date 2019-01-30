const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const read = file => fs.readFileSync(path.join(__dirname,file),'utf-8')

const template = read('template.md')
const loader = read('loader.js')

fs.writeFileSync(path.join(__dirname,'../README.md'),ejs.render(template,{
    load(name,url,fn=`function(){window.${name}.default()}`){
        return 'javascript:'+encodeURIComponent(`${loader}("${name}","${url}",${fn})`)
    }
}))

var devbuild = 'javascript:' + 
    encodeURIComponent(
        '(function(i,s,f){var d=document,e=d.createElement("script"),n=d.getElementById(i);n&&n.parentNode.removeChild(n);(e.src=s,e.id=i,d.body.appendChild(e))})'+
        '("quizsaver","https://127.0.0.1:8080/","function(){window.quizsaver.default()}")'
        )

fs.writeFileSync(path.join(__dirname,'../dist/devbuild.bookmarklet'),devbuild)