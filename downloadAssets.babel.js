'use strict';

const fs = require('fs');
const request = require('request');
const jsonfile = require('jsonfile');



const urlBase = "https://pokeapi.co/api/v2";

let morePokemons = true;
let id = process.argv[0] || 1;
let pokemons = {};

const downloadPokemon = function(id){
  request(urlBase + "/pokemon/" + id, (err, res, body) => {
    if (err) return console.log(err);
    body = JSON.parse(body);
    if (res.body.detail !== "Not found.") {
      pokemons[id] = pokemons[id] || body;
      console.log(body);
      let tempForms = [];
      body.forms.forEach(form => {
        console.log(form);
        request(form, (err, res, body) => {
          if (err) return console.log(err);
          body = JSON.parse(body);
          console.log(body);
          tempForms.push(body);
          const name = body.name;
          try {
            fs.statSync('./src/images/pokemons/' + name);
          } catch(err) {
            if(err.code == 'ENOENT') fs.mkdirSync('./src/images/pokemons/' + name);
          }
          Object.keys(body.sprites).forEach(key => {
            const sprite = body.sprites[key];
            request(sprite).pipe(fs.createWriteStream('./src/images/pokemons/' + name + '/' + key + '.png')).on('close', () => {
              console.log(id, pokemons[id]);
              pokemons[id].forms = tempForms;
              setTimeout(() => {
                id = id + 1;
                downloadPokemon(id);
              }, 3000);
            })
          });
        });
      });
    } else {
      //console.log(res);
      console.log('Done at ID', id);
    }
  });
};



downloadPokemon(id);
jsonfile.writeFile('./src/data/pokemons.json', pokemons, function(err) {
  console.log(err);
});
