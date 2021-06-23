const Discord = require("discord.js");
const fs = require("fs");
exports.Reports = [];
const config = require("../config");

questions=[
    {text:["What platform are you reporting this bug for?\n\n<:wumpus:723623036867182672> - Discord\n<:minecraft:723623036837691504> - Minecraft"],answer:{type:"react",options:["723623036867182672","723623036837691504"]}},
    {text:["Can you replicate the bug?","*You will need to replicate it 100% of the time*"],answer:{type:"react",options:["✅","❎"]}},
    {text:["What is the issue itself?"],answer:{type:"text"}},
    {text:["How can this issue be replicated?"],answer:{type:"text"}},
    {text:["React once you are ready to submit."],answer:{type:"react",options:["✅"]}},
];
answers=[];
class BugReport {
    constructor(user,client) {
        this.applicant=user;
        this.questions_offset=0;
        this.client=client;

        console.log("Bug report started");

        exports.Reports.push(this);

        this.applicant.send("<@"+this.applicant.id+">").then((message)=>message.delete());

        this.applicant.send(new Discord.MessageEmbed()
            .addField("BugReport Started","You have 1 hour to complete these questions before your BugReport is closed.")
            .setColor(config.bot_color));

        this.sendQuestion(questions[this.questions_offset]);
    }

    getType(){
        return this.questions_offset<=questions.length?questions[this.questions_offset].answer.type:null;
    }

    submitAnswer(answer){
        answers.push({question:questions[this.questions_offset],answer:answer});
        this.questions_offset++;
        if(this.questions_offset<questions.length){
            this.sendQuestion(questions[this.questions_offset]);
        }else {
            this.applicant.send(new Discord.MessageEmbed()
                .addField("BugReport Submitted","Your BugReport will now be reviewed by an BugReport Manager.")
                .setColor(config.bot_color));

            (this.client.channels.fetch("714846581026717808")).then((applications_channel)=>{

                var embed = new Discord.MessageEmbed().setColor(config.bot_color).setTitle(this.applicant.username+"#"+this.applicant.discriminator+"'s BugReport");
                embed.setFooter("Submitted by "+this.applicant.id);
                for(var ans_id in answers){
                    var ans = answers[ans_id];
                    if(ans.answer!=null&&ans_id!==answers.length-1)
                        embed.addField(ans.question.text,ans.answer._emoji!==undefined?ans.answer._emoji.name:ans.answer);
                }
                applications_channel.send(embed).then((message)=>message.react("✅").then(r => message.react("❎")));
            })
        }
    }

    sendQuestion(question){
        this.applicant.send(new Discord.MessageEmbed()
            .addField("Question",question.text)
            .setColor(config.bot_color))
            .then((embed)=>{
                switch(question.answer.type){
                    case "text":
                        break;
                    case "react":
                        for (let reaction_id in question.answer.options){
                            embed.react(question.answer.options[reaction_id]);
                        }
                        break;
                    default:
                        console.error("Invalid answer type received "+question.answer.type);
                }
            });
    }
}


exports.create=BugReport;