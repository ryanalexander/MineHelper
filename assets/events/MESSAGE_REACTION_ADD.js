const BugReport = require("../utils/BugReport");
const Discord = require("discord.js");

module.exports = (client,data) => {
    client.channels.fetch(data['d']['channel_id']).then(channel=>{
        client.users.fetch(data['d']['user_id']).then(user=>{
            channel.messages.fetch(data['d']['message_id']).then(message=>{
                if(data['d']['user_id']===client.user.id)return;
                let reaction = message.reactions.resolve(data['d']['emoji']['name']);

                const application = require("../utils/BugReport").Reports.find((Report)=>{return Report.applicant===user;});
                if(application!==undefined&&application.applicant===user){
                    if(application.getType().toLowerCase()==="react")
                        application.submitAnswer(reaction);
                    return false;
                }

                switch (data['d']['emoji']['name']) {
                    case "📜":
                        reaction.users.fetch().then(users=>{
                            users.forEach((user)=>{
                                if(user.id!==client.user.id)
                                    reaction.users.remove(user);
                            })
                            message.react(data['d']['emoji']['name']);
                        })
                        try {
                            user.send("Please answer the following questions to the best of your abilities, if this was not intentional please ignore it and the bot will time-out the report.\n\nAbuse of this system **WILL** result in a ban from the MineGames Discord.").then(()=>{
                                new BugReport.create(user,client);
                            }).catch(()=>{
                                client.channels.fetch("637882771636879380").then(e=>e.send(`Hey <@${user.id}>!\nYou seem to have your Direct Messages closed, this will prevent you from submitting bug reports!\n\nYou can close your Direct Messages after the bug report process has completed.`));
                            })
                        }catch (e) {
                            console.log(e);
                        }
                        break;
                }
            })
        });
    })
};