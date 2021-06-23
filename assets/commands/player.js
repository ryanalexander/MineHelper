const {Discord, MessageEmbed} = require("discord.js");
const http = require('http');
const JavaUtils = require("../utils/JavaUtils");

const config = require("../config.js");

const required_roles = [
    "714834833272209453" /* Moderator */,
    "714849369664520193" /* Developer */,
    "714834833272209455" /* Manager */,
    "714846338516516876" /* Donations Manager */,
    "714846397030989845" /* Staff manager */,
    "714834833272209456" /* Owner */
];

module.exports = (client, message) => {
    let args = message.content.split(" ");
    let target = args[2];
    let embed = new MessageEmbed().setColor(config.bot_color).setTitle("MineGames Players");

    var options = {
        host: 'api.mcg.gg',
        path: '/v1/players/'+target+'?key=f63d9a47-7947-4b8a-b9c7-c8f7dd603dc6'
    }

    http.request(options,(res)=>{
        var str = '';

        //another chunk of data has been received, so append it to `str`
        res.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been received, so we just print it out here
        res.on('end', function () {
            let reply = JSON.parse(str);
            if(reply.player===undefined){
                embed.setDescription("Invalid player requested");

            }else {
                embed.setTitle(reply.player.username);
                embed.setThumbnail("https://crafatar.com/avatars/"+reply.player.uuid);
                embed.addField("Rank", reply.player.rank, true);
                embed.addField("Nickname", "Coming soon", true);
                embed.addField("First Joined", translateTime(new Date().getTime()-reply.player.first_joined)+" ago", false);
                embed.addField("Last Seen", translateTime(new Date().getTime()-reply.player.last_seen)+" ago", true);
            }
            embed.setFooter(`Request took ${reply.took}ms`);
            message.channel.send(embed);
        });
    }).end();
}


function translateTime(time){
    var x = time/1000;
    var seconds = Math.round(x % 60);
    x/=60;
    var minutes = Math.round(x % 60);
    x/=60;
    var hours = Math.round(x % 24);
    x/=24;
    var days = Math.round(x % 365);
    x/=365
    var years = Math.round(x);

    return (years>0?years+" Years ":"")+(days>0?days+" Days ":"")+(hours>0?hours+" Hours ":"")+(minutes>0?minutes+" Minutes ":"")+(seconds>0?seconds+" Seconds ":"");
}