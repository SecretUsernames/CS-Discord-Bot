require("dotenv").config();

const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
//turns on the bot for use
client.on("ready", (c) => {
  console.log(`${c.user.tag} is online.`);
});

//creates interactions and allows them to be changed like what to do when buttons are clicked for roles
client.on("interactionCreate", async (interaction) => {

  try {
    if (interaction.isChatInputCommand()) {  //checks for the slash commands
      if (interaction.commandName == "add") {
        const num1 = interaction.options.get("first-number").value;
        const num2 = interaction.options.get("second-number").value;

        interaction.reply(`The sum is ${num1 + num2}`); //use `` not '' when replying with bot using interactions, allows for use of ${} (interpolation)
      }
      if (interaction.commandName == "embed") {
        //creates embed section for links and images based on slash command
        const embed = new EmbedBuilder()
          .setTitle("Embed title")
          .setURL("https://discord.js.org/")
          .setDescription("This is an embed description")
          .setThumbnail("https://i.imgur.com/AfFp7pu.png")
          .setColor("Random")
          .addFields(
            {
              name: "Field title",
              value: "Some random value",
              inline: true,
            },
            {
              name: "2nd Field title",
              value: "Some random value",
              inline: true,
            }
          )
          .setImage("https://i.imgur.com/AfFp7pu.png");

        interaction.reply({ embeds: [embed] });
      }
    }
  } catch (error) {
    console.log(error);
  }

  try {
    if (interaction.isButton()) {  //checks for the button interactions
      await interaction.deferReply({ ephemeral: true });

      const role = interaction.guild.roles.cache.get(interaction.customId);

      if (!role) {
        interaction.editReply({
          content: "That role does not exist",
        });
        return;
      }

      const member = interaction.member;

      await member.roles.remove(member.roles.cache);

      await member.roles.add(role);

      interaction.editReply(`The role ${role} has been added.`);
    }
  } catch (error) {
    console.log(error);
  }
});

//replys with a message based on what is received in chat
client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content.toLowerCase() == "embed") {
    //creates embed link when embed typed in chat
    const embed = new EmbedBuilder()
      .setTitle("Embed title")
      .setURL("https://discord.js.org/")
      .setDescription("This is an embed description")
      .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .setColor("Random")
      .addFields(
        {
          name: "Field title",
          value: "Some random value",
          inline: true,
        },
        {
          name: "2nd Field title",
          value: "Some random value",
          inline: true,
        }
      )
      .setImage("https://i.imgur.com/AfFp7pu.png");

    message.channel.send({ embeds: [embed] });
  }
  //responds if user says hi to chat
  if (
    message.content.toLowerCase().includes("hello") ||
    message.content.toLowerCase().includes("hey") ||
    message.content.toLowerCase().includes("sup") ||
    message.content.toLowerCase().includes("hi")
  ) {
    message.reply("sup fool");
  }
});

client.login(process.env.TOKEN);
