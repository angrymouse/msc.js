#!/usr/bin/node
var argv = require('yargs-parser')(process.argv.slice(2))
if(argv.i){
const fetch = require('node-fetch');
const fs = require('fs');
let requirements = JSON.parse(fs.readFileSync(__dirname+"/requirements.json", "utf8"))
Object.keys(requirements).forEach(urlBegin => {
  requirements[urlBegin].forEach(urlEnd => {
    fetch(urlBegin + urlEnd)
      .then(res => res.text())
      .then(body => {
        fs.writeFile(urlEnd, body, function() {})
      })

  })
})
}
