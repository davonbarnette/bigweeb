const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Display all commands and descriptions",
  execute(message) {

    let commands = [...message.client.commands].map(([_, value]) => value);
    console.log('commands', commands)

    let helpEmbed = new MessageEmbed()
      .setTitle("boit daddy's here to help")
      .setDescription("List of all commands")
      .setColor("#F8AA2A");

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send({ embeds: [helpEmbed] }).catch(console.error);
  }
};
