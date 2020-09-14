const axios = require('axios');
const utils = require('../util/EvobotUtil');
module.exports = {
  name: "randomchamp",
  cooldown: 1,
  aliases: ["rc"],
  description: "Picks a random champion or team of champions. !randomchamp will give you a random champion, !randomchamp team will give you a team of champions, !randomchamp top|mid|adc|support|jungle will give you a random champion for that role.",
  async execute(message, args) {
    let url = "https://flash.blitz.gg/graphql?query=query%20(%24region%3A%20String%2C%20%24language%3A%20String%2C%20%24queue%3A%20Int%2C%20%24tier%3A%20String%2C%20%24role%3A%20String)%20%7B%0A%20%20lolChampionsListOverview(region%3A%20%24region%2C%20language%3A%20%24language%2C%20queue%3A%20%24queue%2C%20tier%3A%20%24tier%2C%20role%3A%20%24role)%20%7B%0A%20%20%20%20champion_id%0A%20%20%20%20champion%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20avatar%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20key%0A%20%20%20%20%20%20__typename%0A%20%20%20%20%7D%0A%20%20%20%20role%0A%20%20%20%20tier%0A%20%20%20%20total_game_count%0A%20%20%20%20stats%20%7B%0A%20%20%20%20%20%20winRate%0A%20%20%20%20%20%20pickRate%0A%20%20%20%20%20%20banRate%0A%20%20%20%20%20%20games%0A%20%20%20%20%20%20kda%0A%20%20%20%20%20%20totalDamageDealtToChampions%0A%20%20%20%20%20%20damageSelfMitigated%0A%20%20%20%20%20%20trueDamageDealtToChampions%0A%20%20%20%20%20%20heals%0A%20%20%20%20%20%20gold%0A%20%20%20%20%20%20creepScore%0A%20%20%20%20%20%20avgDamageToTurrets%0A%20%20%20%20%20%20averageGameTime%0A%20%20%20%20%20%20damage%0A%20%20%20%20%20%20damageTaken%0A%20%20%20%20%20%20averageGameSeconds%0A%20%20%20%20%20%20__typename%0A%20%20%20%20%7D%0A%20%20%20%20matchups%20%7B%0A%20%20%20%20%20%20champion%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20avatar%0A%20%20%20%20%20%20%20%20key%0A%20%20%20%20%20%20%20%20__typename%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20winRate%0A%20%20%20%20%20%20__typename%0A%20%20%20%20%7D%0A%20%20%20%20tier_ranks%20%7B%0A%20%20%20%20%20%20previous_tier_rank%0A%20%20%20%20%20%20tier_rank%0A%20%20%20%20%20%20status%0A%20%20%20%20%20%20__typename%0A%20%20%20%20%7D%0A%20%20%20%20__typename%0A%20%20%7D%0A%7D%0A&variables=%7B%22language%22%3A%22en%22%2C%22role%22%3A%22ALL%22%2C%22region%22%3A%22world%22%2C%22queue%22%3A420%2C%22tier%22%3A%22PLATINUM_PLUS%22%2C%22patch%22%3A%2210.16%22%7D";

    let split = message.content.split(' ');
    const [_, _2, third] = split;
    let send = '';
    try {
          let res = await axios.get(url);
          let champions = res.data.data['lolChampionsListOverview'];
          // let champs = Object.keys(champions).map(key => champions[key].id);

          let roleMap = {};
          champions.forEach(championData => {
              const {role, champion, stats} = championData;
              if (!roleMap[role]) roleMap[role] = [];
              roleMap[role].push({championName: champion.name, winRate: stats.winRate, role: role});
          })

          if (third === 'team') {
              send = '----\n' + Object.keys(roleMap).map(key => {
                  let championList = roleMap[key];
                  let random = utils.pickRandomElement(championList);
                  return `**${random.role}**: ${random.championName} (_${random.winRate}%_)`
              }).join('\n');
          } else if (third && roleMap[third.toUpperCase()]) {
              let random = utils.pickRandomElement(roleMap[third.toUpperCase()]);
              send = `**${random.role}**: ${random.championName} (_${random.winRate}%_)`;
          } else {
              let random = utils.pickRandomElement(champions);
              send = `**${random.role}**: ${random.champion.name} (_${random.stats.winRate}%_)`
          }
      } catch (e) {

      }
    return message.channel.send(send)
  }
};
