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

const { setupRoleAssignment } = require("./send-message.js"); //imports the role assignment from send-message

//turns on the bot for use
client.on("ready", (c) => {
  console.log(`${c.user.tag} is online.`);
});

//creates interactions and allows them to be changed like what to do when buttons are clicked for roles
client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      //checks for the slash commands
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
    if (interaction.isButton()) {
      //checks for the button interactions on roles
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

//creates random responses based on received message
const responses = {
  hi: ["What up", "No hablo ingles", "I'm just a random response"],
  // Add more content-response pairs as needed
};

//function for grabbing a random reponses
function getRandomResponse(content) {
  if (responses[content]) {
    const responseArray = responses[content];
    const randomIndex = Math.floor(Math.random() * responseArray.length);
    return responseArray[randomIndex];
  }
  return null;
}

//does something based on what message is received in chat
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

  if (
    message.content.toLowerCase().includes("hello") ||
    message.content.toLowerCase().includes("hey") ||
    message.content.toLowerCase().includes("sup")
  ) {
    message.reply("sup fool");
  }
  //responds if user says hi to chat
  if (message.content.toLowerCase().includes("hi")) {
    // Get a random response for the content
    const response = getRandomResponse("hi");

    // Reply with the random response
    if (response) {
      message.reply(response);
    }
  }

  if (message.content.toLowerCase().includes("role")) {
    setupRoleAssignment(client, message.channel);
  }
});

client.on("guildMemberAdd", (member) => {
  // Trigger the role assignment functionality when a new member joins
  setupRoleAssignment(client, member.guild.systemChannel);
});

client.login(process.env.TOKEN);
