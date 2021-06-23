const {Discord, MessageEmbed} = require("discord.js");

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
    let target = client.guilds.resolve("599939836421341204").member(args[2]);
    let embed = new MessageEmbed().setColor(config.bot_color).setTitle("MineGames Kick");

    if(target === null && message.mentions.users.size>0)
        target=client.guilds.resolve("599939836421341204").member(message.mentions.users.first().id);

    let access=message.member.roles.cache.filter((role, snowflake) => required_roles.indexOf(snowflake)>=1).size>=1;

    if(!access) {
        embed.setDescription("You are not permitted to do that!");
    }else if(target == null){
        embed.setDescription("Usage: `!mg kick [id] [reason]`");
    }else if(message.member.roles.highest<target.roles.highest){
        embed.setDescription(`You cannot kick that person!`);
        embed.setFooter(`<@${message.member.id}> attempted to kick ${target.id}`);
    }else {
        let reason = "";
        for (var i = 3; i < args.length; i++) {
            reason += args[i] + (i === args.length - 1 ? "" : " ");
        }
        if (reason === "") {
            // No reason provided
            embed.setDescription("Usage: `!mg kick [id] [reason]`\n\nYou did not specify a reason");
        } else {
            embed.setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.webp`);
            embed.setTitle(`Member kicked`);
            embed.setDescription(`<@${target.id}> has been kicked.`)
            embed.addField("Reason", reason, true);
        }
    }

    message.channel.send(embed);
}