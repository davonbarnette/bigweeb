const Discord = require('discord.js');
const Register = require ('./register');
const SETTINGS = require('./settings');
const Logger = require('./utils/logger');
const IDoThings = require('./utils/idothings');

class BigWeeb {

    constructor(register){
        this.register = register;
        this.startEmUp();
    }

    async startEmUp(){
        const {DISCORD_TOKEN:token} = SETTINGS;
        if (token){
            this.bot = new Discord.Client();
            this.bot.on('ready', this.onOpen.bind(this));
            this.bot.on('message', this.onMessage.bind(this));
            await this.bot.login(token);
        }
    }

    async onOpen(){
        Logger.info('[BigWeeb] Slackboit connection opened');
    }

    async onMessage(msg){
        // Logger.info('[BigWeeb] Incoming Message Event from Discord > ', msg);
        if (!msg.author.bot){
            if (msg.content === 'calling helpdesk') this.sendHelpDesk();
            else await this.iterateRegister(msg, this.handlePost.bind(this));
        }
    }

    handlePost(post, msg) {
        let {message, params, stop, spongebobify, channel} = post;
        Logger.info('Attempting to post message to channel > ', message);
        if (spongebobify !== false) message = IDoThings.spongebobMemeify(message);
        msg.channel.send(message);
        if (stop) return 'stop';
    }

    async iterateRegister(msg, handlePost) {
        for (let i = 0; i < this.register.length; i++) {
            const item = this.register[i];
            let exec = item;
            if (item.hasOwnProperty('function')) exec = item.function;
            let post = await exec(msg);
            if (post) {
                if (!handlePost) return post;
                let handled = handlePost(post, msg);
                if (handled === 'stop') return;
            } else if (post === null) return null;
        }
    }
    sendHelpDesk(){
        let start = '----\n';
        for (let i = 0; i < this.register.length; i++) {
            const item = this.register[i];
            if (item.hasOwnProperty('command')) {
                const {description, command} = item;
                start += `*${command}*\n_${description}_\n`;
            }
            start += '\n\n'
        }
        return this.bot.channels.cache.get('744025952853557258').send(start);
    }
}

module.exports = new BigWeeb(Register)