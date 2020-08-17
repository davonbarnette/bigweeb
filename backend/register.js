const Yeetus = require("./functions/yeetus");

/*
 * This file is where you'll register all of your functions. At the very least, there are 3 things you need to have in
 * your object: description, command, and function. The rest are optional, but that may change in the future. You can also
 * just pass the function itself, but that will mean it won't show up under Slackboit's helper function (the one that shows
 * all of the available Slackboit functions).
 *
 * Lastly, remember how this works. It runs through each one sequentially. So, it'll pass the text through crimeAlert,
 * then through refreshCrypto and so on.
 *
 */

const Register = [
    // *** Davon *** //
    {
        acknowledge: "bigweeb ",
        name: "The Original Meme",
        command: "bigweeb [PHRASE]",
        description: "Spongeboit",
        function: Yeetus.spongebobMeme
    },
    {
        acknowledge: "pickweeb ",
        name: "Pick ya champ bruv",
        command: "pickweeb [as-team | mid | top | adc | jungle | support]",
        description: "Just passing 'pickweeb' will send you a random champion. If you pass a second one, it will give you champions for that role(s).",
        function: Yeetus.pickRandomChampion
    },
];

module.exports = Register;
