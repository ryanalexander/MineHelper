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
    let target = client.guilds.resolve("599939836421341204").member(args[2]);
    let embed = new MessageEmbed().setColor(config.bot_color).setTitle("MineGames Bans");

    if(target === null && message.mentions.users.size>0)
        target=client.guilds.resolve("599939836421341204").member(message.mentions.users.first().id);

    let access=message.member.roles.cache.filter((role, snowflake) => required_roles.indexOf(snowflake)>=1).size>=1;

    if(!access) {
        embed.setDescription("You are not permitted to do that!")
    }else if(message.member.roles.highest<target.roles.highest){
        embed.setDescription(`You cannot ban that person!`);
        embed.setFooter(`<@${message.member.id}> attempted to ban ${target.id}`);
    }else {
        if (target == null) {
            embed.setDescription("Usage: `!mg ban [id] [reason]`");
        } else {
            var duration;
            var remove = 0;
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                var matcher = /(\d*)([mhdw])/g.exec(arg);

                if (matcher != null) {
                    remove = i;
                    switch (matcher[2].toUpperCase()) {
                        case "W":
                            duration = parseInt(matcher[1]) * 6.048e+8;
                            break;
                        case 'D':
                            duration = parseInt(matcher[1]) * 8.64e+7;
                            break;
                        case "H":
                            duration = parseInt(matcher[1]) * 3.6e+6;
                            break;
                        case "M":
                            duration = parseInt(matcher[1]) * 60000;
                            break;
                    }
                }
            }

            let reason = "";
            for (var i = 3; i < args.length; i++) {
                if (i === remove) continue;
                reason += args[i] + (i === args.length - 1 ? "" : " ");
            }

            if (reason === "") {
                embed.setDescription("Usage: `!mg ban [id] [reason]`\n\nYou did not specify a reason");
            } else {
                embed.setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.webp`);
                embed.setTitle(`Member banned`);
                embed.setDescription(`<@${target.id}> has been banned.`)
                embed.addField("Reason", reason, true);
            }
        }
    }

    message.channel.send(embed);
}