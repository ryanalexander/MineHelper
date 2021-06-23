const {Discord, MessageEmbed} = require("discord.js");
const JavaUtils = require("../utils/JavaUtils");
const fs = require("fs");

const config = require("../config.js");
const schedule = JSON.parse(fs.readFileSync("./assets/schedule.json").toString());

const required_roles = [
    "635739260254945301" /* Helper */,
    "714834833272209453" /* Moderator */,
    "714849369664520193" /* Developer */,
    "714834833272209455" /* Manager */,
    "714846338516516876" /* Donations Manager */,
    "714846397030989845" /* Staff manager */,
    "714834833272209456" /* Owner */
];

module.exports = (client, message) => {
    let args = message.content.split(" ");
    let embed = new MessageEmbed().setColor(config.bot_color).setTitle("MineGames Moderation");

    let access=message.member.roles.cache.filter((role, snowflake) => required_roles.indexOf(snowflake)>=1).size>0;

    if(!access) {
        embed.setDescription("You are not permitted to do that!");
    }else if(message.mentions.channels.size===0){
        embed.setDescription("Usage: !mg lock <#[channel id]> [duration] [reason]")
    }else {
        var duration = 0;
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

        schedule.push({
            "action": "unlock",
            "channel": message.mentions.channels.first(),
            "time":(new Date()).getTime()+duration
        });
        fs.writeFileSync("./assets/schedule.json",JSON.stringify(schedule));

        setTimeout(() => {
            let event = schedule.indexOf(schedule.find(field => field.action==="unlock"&&field.channel===message.channel.id));
            if(event!==undefined&&event!=null){
                schedule.splice(event,1);
                fs.writeFileSync("./assets/schedule.json",JSON.stringify(schedule));
                message.mentions.channels.first().overwritePermissions([
                    {
                        id: message.mentions.channels.first().guild.roles.everyone,
                        deny: ['SEND_MESSAGES']
                    }
                ]);
                embed.setDescription("This chat has been unlocked");
                message.mentions.channels.first().send(embed);
            }
        },duration);

        message.mentions.channels.first().overwritePermissions([
            {
                id: message.mentions.channels.first().guild.roles.everyone,
                allow: ['SEND_MESSAGES']
            }
        ]);
        embed.setDescription("This chat has been locked");
        embed.addField("Duration",duration>0?JavaUtils.formatTime(duration):"until further notice")
        embed.setFooter(`Locked by ${message.member.id}`)
    }

    message.mentions.channels.first().send(embed);
}