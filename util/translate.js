const {Translate} = require('@google-cloud/translate').v2;
const Kuroshiro = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

class TranslationManager {

    languagesKeyedByCode = {};
    kuroshiro = new Kuroshiro();
    translate = new Translate();
    text;

    constructor(text) {
        this.text = text;
        this.init();
    }

    async init() {
        await this.initializeLanguages();
        await this.initializeKuroshiro();
    }

    async initializeLanguages() {
        let languagesKeyedByCode = {}
        let [languages] = await this.translate.getLanguages();
        languages.forEach(language => languagesKeyedByCode[language.code] = language.name);
        this.languagesKeyedByCode = languagesKeyedByCode;
    }

    async initializeKuroshiro() {
        await this.kuroshiro.init(new KuromojiAnalyzer())
    }

    async getDetectionLanguage(text) {
        let [detections] = await this.translate.detect(text);
        detections = Array.isArray(detections) ? detections : [detections];
        if (detections[0]) {
            let firstDetectedLanguage = detections[0]
            return this.languagesKeyedByCode[firstDetectedLanguage.language];
        } else {
            return "";
        }
    }

    async getTranslations(text, targetLanguage) {
        let [translations] = await this.translate.translate(text, targetLanguage);
        return Array.isArray(translations) ? translations : [translations];
    }

    async getJapaneseTranslations(types) {
        let ret = [];
        for (let i = 0; i < types.length; i++) {
            const type = types[i];
            let conversion = await this.kuroshiro.convert(
                this.text,
                {to: type.toLowerCase(), mode: 'spaced'}
            );
            ret.push(conversion);
        }
        return ret;
    }
}

module.exports = TranslationManager;