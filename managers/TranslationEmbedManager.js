const {MessageEmbed} = require("discord.js");
const TranslationManager = require("../util/translate");

class TranslationEmbedManager {

    translations = "";

    constructor({text = "", targetLanguage = "en"}) {
        this.messageEmbed = new MessageEmbed();
        this.text = text;
        this.targetLanguage = targetLanguage;
        this.translationManager = new TranslationManager(text);
        this.messageEmbed
            .setTitle("bigweeb's fat translate")
            .setDescription(text)
            .setColor("#F8AA2A");
    }

    async addDetectionLanguage() {
        let detectionLanguage = await this.translationManager.getDetectionLanguage(this.text);
        this.messageEmbed.addField(
            "Detected Language",
            detectionLanguage
        )
        this.detectionLanguage = detectionLanguage;
        return this;
    }

    async addTranslations() {
        let translations = await this.translationManager.getTranslations(this.text, this.targetLanguage);
        for (let i = 0; i < translations.length; i++) {
            const translation = translations[i];
            this.messageEmbed.addField(
                `Translation ${i + 1}:`,
                `${translation}`,
            )
        }
        if (this.detectionLanguage === "Japanese") {
            await this.addJapaneseHelpers();
        }
        this.translations = translations;
        return this;
    }

    async addJapaneseHelpers() {
        let japaneseTranslations = this.translationManager.getJapaneseTranslations(['Hiragana', 'Katakana', 'Romaji'])

        for (let i = 0; i < japaneseTranslations.length; i++) {
            const japaneseTranslation = japaneseTranslations[i];
            console.log('japanese translation', japaneseTranslation);
            // this.messageEmbed.addField(
            //     type,
            //     conversion,
            // )
        }
    }
}

module.exports = TranslationManager;