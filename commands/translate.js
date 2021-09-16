const {TranslationEmbedManager} = require("../managers/TranslationEmbedManager");

const {MessageEmbed} = require("discord.js");
const { getDetectionLanguage, getTranslations } = require('../util/translate')

module.exports = {
    name: "translate",
    aliases: ["tr"],
    description: "Translate ",
    async execute(message) {
        let {content} = message;
        let removedNameArray = content.split(" ").slice(1);
        let text = removedNameArray.join("");

        let translationEmbedManager = new TranslationEmbedManager({ text, targetLanguage: 'en' })
        await translationEmbedManager.addDetectionLanguage();
        await translationEmbedManager.addTranslations();




        // return message.channel.send({embeds: [translateEmbed]}).catch(console.error);
    }
};
