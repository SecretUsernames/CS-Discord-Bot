require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

//creates commands to be used
const commands = [
  {
    name: "add",
    description: "Adds two numbers.",
    options: [
      {
        name: "first-number",
        description: "The first number",
        type: ApplicationCommandOptionType.Number, //if changing this to a string or other, make sure to change value as well
        choices: [
          //provides different choices to pick from when using this commands
          {
            name: "one",
            value: 1,
          },
          {
            name: "two",
            value: 2,
          },
          {
            name: "three",
            value: 3,
          },
        ],
        required: true, //if you make this false, make sure to change interaction and add a ? like, const num1 = interaction.options.get('first-number')?.value;
      },
      {
        name: "second-number",
        description: "The second number",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  {
    name: "embed",
    description: "Sends an embed!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

//registers the commands so they have functionality
(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Slash commands were registered successfully!");
  } catch (error) {
    console.error(`There was an error: ${error}`);
  }
})();
