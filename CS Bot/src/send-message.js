require("dotenv").config();

const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const roles = [
  {
    id: "1167364594164047892",
    label: "Binary Wizard",
  },
  {
    id: "1167366316211044403",
    label: "Code Poet",
  },
  {
    id: "1167366430879121408",
    label: "Syntax Sorcerer",
  },
];

//creates buttons to assign roles when client enters server(guild)
function setupRoleAssignment(client, channel) {
      const row = new ActionRowBuilder();

      roles.forEach((role) => {
        //creates the buttons for every role
        row.components.push(
          new ButtonBuilder()
            .setCustomId(role.id)
            .setLabel(role.label)
            .setStyle(ButtonStyle.Primary)
        );
      });

      channel.send({
        //asks for what role is wanted
        content: "Choose your path",
        components: [row],
        ephemeral: true,
      });
}

client.login(process.env.TOKEN);
module.exports = { setupRoleAssignment };
