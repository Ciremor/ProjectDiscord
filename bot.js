const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config()
const config = require('./config.json');
const axios = require('axios').default;
const fs = require('fs');
const { strict } = require('assert');


var prefix = config.prefix;



//Log in pour le bot
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('ready', () => {
    client.user.setActivity(`${prefix}help`,{type:"PLAYING"});
});
//toutes les commandes

function printCount(response,message) {
    if (response.data.type === "success") {
        message.channel.send(response.data.value)
    }else{
        message.channel.send("Erreur : response data nik");
    }  
}

function printResponse(response,message) {
    if (response.data.type === "success") {
        message.channel.send(response.data.value.joke)
    }else{
        message.channel.send("Erreur : response data nik");
    }  
};

function printCategories(response,message) {
    if (response.data.type === "success") {
        message.channel.send(response.data.value)
    }else{
        message.channel.send("Erreur : response data nik");
    }  
};

function erreur(err){
    console.log(err)
};


client.on('message', message =>{
    if (message.content.startsWith(`${prefix}`)) {
        let command = message.content.slice(prefix.length)

        if (command.startsWith('prefix')) {
            var newPrefix=message.content.slice(8);
            if (newPrefix.length==1){
                config.prefix=newPrefix; 
                let configJson = JSON.stringify(config);
                fs.writeFile('./config.json',configJson, (erreur) => {
                    if (erreur) console.log(erreur);
                    else message.channel.send (`Prefix has been changed to ${newPrefix}`);
                })
                prefix = config.prefix;
            } else {
                message.channel.send(`Prefix is still ${prefix}, prefix suggested not correct`);
            }
            client.user.setActivity(`${prefix}help`,{type:"PLAYING"});
        }

        if (command.startsWith('joke')) {
            var jokeargs = message.content.slice(6);
            if (jokeargs.length) {
                const categorie = jokeargs.toLowerCase();
                if (categorie - 0) {
                    axios.get(`http://api.icndb.com/jokes/${categorie}`)
                    .then(response => message.channel.send(`joke id : ${response.data.value.joke}`))
                    .catch(error => console.log(error));
                }
                else {
                    axios.get(`http://api.icndb.com/jokes/random?limitTo=[${categorie}]`)
                    .then(response => message.channel.send(`joke categorie : ${response.data.value.joke}`))
                    .catch(error => console.log(error)); 
                }
            } 
            else{
                axios.get('http://api.icndb.com/jokes/random')
                .then(response => printResponse(response,message))
                .catch(err => erreur(err))
            }
        }


        switch (command) {
            case "jokeCount":
                axios.get('http://api.icndb.com/jokes/count')
                .then(response => printCount(response,message))
                .catch(err => erreur(err))
                break;
            
            case "jokeCategories":
                axios.get('http://api.icndb.com/categories')
                .then(response => printCategories(response,message))
                .catch(err => erreur(err))
                break;

            case "ping":
                var ping = Date.now() - message.createdTimestamp + "ms";
                message.channel.send("Your ping is " + `${ping} ` + " Pong !");
                break;

            case "help":
                message.channel.send(`
                Voici une liste des commandes :

                **${prefix}help** - Afficher le menu d'aide
                **${prefix}joke** - Renvoie une blague aléatoire
                **${prefix}joke [id]** - Renvoie une blague avec un id précis (certaines ne marchent pas)
                **${prefix}joke [categorie]** - Renvoie une blague aléatoire d'une catégorie
                **${prefix}jokeCount** - Afficher le nombre de blagues
                **${prefix}jokesCategories** - Afficher les catégories de blagues
                **${prefix}ping** - Renvoie ton ping
                **${prefix}prefix [prefix]** - Change le préfix des commandes

                
                
                `)
                break;
            default:
                break;
        }
    }
})

client.login(config.token);