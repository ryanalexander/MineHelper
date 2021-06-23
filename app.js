const Discord = require("discord.js")

const client = new Discord.Client();

client.on("ready",()=>{
    console.log("Bot is now online");
});

client.on("message",(message)=>{

    const application = require("./assets/utils/BugReport").Reports.find((Report)=>{return Report.applicant===message.author;});
    if(application!==undefined){
        if(application.getType().toLowerCase()==="text")
            application.submitAnswer(message);
        return false;
    }

    if(message.content.startsWith("!mg ")){
        try {
            require("./assets/commands/" + message.content.split(" ")[1] + ".js")(client, message);
            //message.delete();
        }catch (e) {
            console.log(e);
        }
    }

});

client.on("voiceStateUpdate",(oldsState, newsState)=>{
    if(oldsState.channelID!==newsState.channelID){
        if(newsState.channelID!==null){
            newsState.guild.channels.create(newsState.channel.name,{
                type: 'text',
                parent: newsState.channel.parent.id,
                position: newsState.channel.position,
                permissionOverwrites: [
                    {
                        id: newsState.guild.roles.everyone.id,
                        deny: "VIEW_CHANNEL",
                        type: "ROLE"
                    }
                ]
            })
        }
    }
})

client.on("raw",(data)=>{
    try {
        require("./assets/events/" + data['t'] + ".js")(client, data);
    }catch (e) {
        if(e.code==="MODULE_NOT_FOUND")return;
        console.log(e);
    }
});

client.login("");