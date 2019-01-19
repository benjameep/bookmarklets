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
