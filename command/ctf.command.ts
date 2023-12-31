import { CacheType, Client, GuildMember, Interaction } from "discord.js"
import { checkFlag, deleteChallenge, getAllChallenge, saveFlag, updateURLChall } from "../controller/flag.controller";
import { getInfoHacker, updateLevelAllUser } from "../controller/player.controller";

const adminPassword = process.env.ADMIN_PASSWORD;

const CTFCommand = {
    command: (bot: Client) => {
        bot.on("interactionCreate", async (interaction: Interaction<CacheType>) => {
            if (!interaction.isChatInputCommand()) return;

            const { commandName, user, options } = interaction;


            switch (commandName) {
                case "ping":
                    await interaction.reply("Pong !!!");
                    break;
                case "flag":
                    await checkFlag(options.getString("flag"), user, interaction);
                    break;
                case "challenge":
                    const password = options.getString("password");
                    if (password == adminPassword) {
                        await saveFlag(options.getString("id"),
                            options.getString("author"),
                            options.getString("chall"),
                            options.getNumber("point"),
                            options.getString("level"),
                            options.getString("description"),
                            options.getString("flag"),
                            options.getBoolean("public"),
                            options.getString("url"),
                            options.getString("category"),
                            interaction
                        );
                    } else {
                        await interaction.reply("[!] Bạn không phải là admin để thực hiện tính năng này!!");
                    }
                    break;
                case "infohacker":
                    const hacker = options.getUser("hacker");
                    await getInfoHacker(hacker ?? user, interaction);
                    break;
                case "listchall":
                    await getAllChallenge(options.getString("password") == adminPassword, options.getString("category"), interaction);
                    break;
                case "rmchall":
                    await deleteChallenge(options.getString("password") == adminPassword,
                        options.getString("id"), interaction);
                    break;
                case "updatechall":
                    await updateURLChall(options.getString("password") == adminPassword,
                        options.getString("id"), options.getString("url"), options.getBoolean("status"), interaction);
                    break;
                case "update":
                    await updateLevelAllUser(options.getString("password") == adminPassword, interaction);
                    break;
            }
        })
    } 
}

export default CTFCommand;