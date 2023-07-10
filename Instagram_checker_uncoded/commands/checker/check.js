const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { IgApiClient } = require('instagram-private-api');
const axios = require('axios')
const client = require("../..");
const { clientId,owner} = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('check')
    .setDescription('فحص حساب انستجرام')
    .addStringOption(Option => 
        Option
        .setName('username')
        .setDescription('اسم المستخدم')
        .setRequired(true))
        .addStringOption(Option => 
            Option
            .setName('password')
            .setDescription('الباسورد')
            .setRequired(true)) // or false
	,
async execute(interaction) {
    if (!owner.includes(interaction.user.id)) return;
    try {
        let username = interaction.options.getString(`username`)
    let password = interaction.options.getString(`password`)
	 await interaction.deferReply({ephemeral :false})
     const ig = new IgApiClient();
      ig.state.generateDevice(username);
     await ig.account.login(username, password);
     const account = await ig.user.searchExact(username);
      const requiresVerification = account.is_private && !account.has_anonymous_profile_picture;
      let accountType = 'Personal';
      if (account.is_business_account || account.is_professional_account) {
        accountType = 'Professional';
      }
      let embed1 = new EmbedBuilder()
      .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#000000')
        .setTitle(`**Account Working**`)
        .addFields(
            {
                name:`**Username**`,value:`\`\`\`${username}\`\`\``,inline:false
            },
            {
                name:`**Need Verify ?**`,value:`\`\`\`${requiresVerification}\`\`\``,inline:false
            },
            {
                name:`**Account Type**`,value:`\`\`\`${accountType}\`\`\``,inline:false
            }
            
        )
        return interaction.editReply({embeds:[embed1]})
    } catch  {
        return interaction.editReply({content:`**Account Didn't Work**`})
    }
	

}
}