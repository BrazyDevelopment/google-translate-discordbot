const { Client, GatewayIntentBits } = require('discord.js');
const translate = require('@iamtraction/google-translate');
const config = require('config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const prefix = '!';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'translate') {
    if (args.length < 1) {
      return message.reply('Usage: !translate [target_language_code] <text_to_translate>');
    }

    let targetLang = args.shift().toLowerCase();
    const textToTranslate = args.join(' ');

    // Check if the target language is a valid language code
    const supportedLanguages = ['en', 'es', 'fr', 'de', 'it'];
    if (!supportedLanguages.includes(targetLang)) {
      return message.reply(`The language '${targetLang}' is not supported.`);
    }

    try {
      const result = await translate(textToTranslate, { to: targetLang });

      console.log(result);

      const fromLanguage = result.from?.language?.iso || 'auto';
      const toLanguage = result.to?.language?.iso || targetLang;

      message.channel.send(`Translation (${fromLanguage} to ${toLanguage}): ${result.text}`);
    } catch (error) {
      console.error('Error during translation:', error);
      message.reply('An error occurred during translation. Please try again.');

      // Log the complete error details
      console.error('Translation Error Details:', {
        command,
        targetLang,
        textToTranslate,
        error: {
          code: error.code,
          message: error.message,
          stack: error.stack,
        },
      });
    }
  }
});

client.login(config.token);
