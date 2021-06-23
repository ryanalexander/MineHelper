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

    let access=message.member.roles.cache.filter((role, snowflake) => required_roles.indexOf(snowflake)>=1).size>=1;

    if(!access) {
        embed.setDescription("You are not permitted to do that!");
    }else {

        let event = schedule.indexOf(schedule.find(field => field.action==="unlock"&&field.channel===message.channel.id));
        if(event!==undefined&&event!=null){
            schedule.splice(event,1);
            fs.writeFileSync("./assets/schedule.json",JSON.stringify(schedule));
        }

        message.channel.createOverwrite(message.channel.guild.roles.everyone,{SEND_MESSAGES: true},`Unlocked by ${message.member.id}`);
        embed.setDescription("This chat has been unlocked");
        embed.setFooter(`Unlocked by ${message.member.id}`)
    }

    message.channel.send(embed);
}