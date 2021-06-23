const {Discord, MessageEmbed} = require("discord.js");

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
    let targets = [];
    let embed = new MessageEmbed().setColor(config.bot_color).setTitle("MineGames Bans");

    let access=message.member.roles.cache.filter((role, snowflake) => required_roles.indexOf(snowflake)>=1).size>=1;

    if(!access) {
        embed.setDescription("You are not permitted to do that!")
    }else {
        client.guilds.resolve("599939836421341204").member(args[2]);
        let reason = "";
        for (var i = 3; i < args.length; i++) {
            reason += args[i] + (i === args.length - 1 ? "" : " ");
        }
        for(var i=0;i<args[2].split(",").length;i++){
            let id = args[2].split(",")[i];
            client.guilds.resolve("599939836421341204").ban(id,{reason:reason});
        }
        embed.setDescription("Banned "+args[2].split(",").length+" members");
    }

    message.channel.send(embed);
}