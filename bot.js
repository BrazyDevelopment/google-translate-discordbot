const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const config = require('./config.json');
const translate = require('@iamtraction/google-translate');
const Tesseract = require('tesseract.js');

const prefix = '.';

const supportedLanguages = [
  { code: 'af', emoji: ':flag_za:' },   // Afrikaans
  { code: 'sq', emoji: ':flag_al:' },   // Albanian
  { code: 'am', emoji: ':flag_et:' },   // Amharic
  { code: 'ar', emoji: ':flag_sa:' },   // Arabic
  { code: 'hy', emoji: ':flag_am:' },   // Armenian
  { code: 'az', emoji: ':flag_az:' },   // Azerbaijani
  { code: 'eu', emoji: ':flag_eu:' },   // Basque
  { code: 'be', emoji: ':flag_by:' },   // Belarusian
  { code: 'bn', emoji: ':flag_bd:' },   // Bengali
  { code: 'bs', emoji: ':flag_ba:' },   // Bosnian
  { code: 'bg', emoji: ':flag_bg:' },   // Bulgarian
  { code: 'my', emoji: ':flag_mm:' },   // Burmese
  { code: 'ca', emoji: ':flag_ca:' },   // Catalan
  { code: 'km', emoji: ':flag_kh:' },   // Khmer
  { code: 'hr', emoji: ':flag_hr:' },   // Croatian
  { code: 'cs', emoji: ':flag_cz:' },   // Czech
  { code: 'da', emoji: ':flag_dk:' },   // Danish
  { code: 'nl', emoji: ':flag_nl:' },   // Dutch
  { code: 'en', emoji: ':flag_gb:' },   // English
  { code: 'eo', emoji: ':flag_eu:' },   // Esperanto
  { code: 'et', emoji: ':flag_ee:' },   // Estonian
  { code: 'fi', emoji: ':flag_fi:' },   // Finnish
  { code: 'fr', emoji: ':flag_fr:' },   // French
  { code: 'gl', emoji: ':flag_es:' },   // Galician
  { code: 'ka', emoji: ':flag_ge:' },   // Georgian
  { code: 'de', emoji: ':flag_de:' },   // German
  { code: 'el', emoji: ':flag_gr:' },   // Greek
  { code: 'gu', emoji: ':flag_in:' },   // Gujarati
  { code: 'ht', emoji: ':flag_ht:' },   // Haitian Creole
  { code: 'ha', emoji: ':flag_ng:' },   // Hausa
  { code: 'haw', emoji: ':flag_us:' },  // Hawaiian
  { code: 'iw', emoji: ':flag_il:' },   // Hebrew
  { code: 'hi', emoji: ':flag_in:' },   // Hindi
  { code: 'hmn', emoji: ':globe_with_meridians:' },  // Hmong
  { code: 'hu', emoji: ':flag_hu:' },   // Hungarian
  { code: 'is', emoji: ':flag_is:' },   // Icelandic
  { code: 'ig', emoji: ':flag_ng:' },   // Igbo
  { code: 'id', emoji: ':flag_id:' },   // Indonesian
  { code: 'ga', emoji: ':flag_ie:' },   // Irish
  { code: 'it', emoji: ':flag_it:' },   // Italian
  { code: 'ja', emoji: ':flag_jp:' },   // Japanese
  { code: 'jw', emoji: ':flag_id:' },   // Javanese
  { code: 'kn', emoji: ':flag_in:' },   // Kannada
  { code: 'kk', emoji: ':flag_kz:' },   // Kazakh
  { code: 'km', emoji: ':flag_kh:' },   // Khmer
  { code: 'ko', emoji: ':flag_kr:' },   // Korean
  { code: 'ku', emoji: ':flag_iq:' },   // Kurdish
  { code: 'ky', emoji: ':flag_kg:' },   // Kyrgyz
  { code: 'lo', emoji: ':flag_la:' },   // Lao
  { code: 'la', emoji: ':flag_va:' },   // Latin
  { code: 'lv', emoji: ':flag_lv:' },   // Latvian
  { code: 'lt', emoji: ':flag_lt:' },   // Lithuanian
  { code: 'lb', emoji: ':flag_lu:' },   // Luxembourgish
  { code: 'mk', emoji: ':flag_mk:' },   // Macedonian
  { code: 'mg', emoji: ':flag_mg:' },   // Malagasy
  { code: 'ms', emoji: ':flag_my:' },   // Malay
  { code: 'ml', emoji: ':flag_in:' },   // Malayalam
  { code: 'mt', emoji: ':flag_mt:' },   // Maltese
  { code: 'mi', emoji: ':flag_nz:' },   // Maori
  { code: 'mr', emoji: ':flag_in:' },   // Marathi
  { code: 'mn', emoji: ':flag_mn:' },   // Mongolian
  { code: 'ne', emoji: ':flag_np:' },   // Nepali
  { code: 'no', emoji: ':flag_no:' },   // Norwegian
  { code: 'ny', emoji: ':flag_mw:' },   // Chichewa
  { code: 'ps', emoji: ':flag_af:' },   // Pashto
  { code: 'fa', emoji: ':flag_ir:' },   // Persian
  { code: 'pl', emoji: ':flag_pl:' },   // Polish
  { code: 'pt', emoji: ':flag_pt:' },   // Portuguese
  { code: 'pa', emoji: ':flag_in:' },   // Punjabi
  { code: 'ro', emoji: ':flag_ro:' },   // Romanian
  { code: 'ru', emoji: ':flag_ru:' },   // Russian
  { code: 'sm', emoji: ':flag_ws:' },   // Samoan
  { code: 'gd', emoji: ':flag_gb:' },   // Scottish Gaelic
  { code: 'sr', emoji: ':flag_rs:' },   // Serbian
  { code: 'st', emoji: ':flag_ls:' },   // Sesotho
  { code: 'sn', emoji: ':flag_zw:' },   // Shona
  { code: 'sd', emoji: ':flag_pk:' },   // Sindhi
  { code: 'si', emoji: ':flag_lk:' },   // Sinhala
  { code: 'sk', emoji: ':flag_sk:' },   // Slovak
  { code: 'sl', emoji: ':flag_si:' },   // Slovenian
  { code: 'so', emoji: ':flag_so:' },   // Somali
  { code: 'es', emoji: ':flag_es:' },   // Spanish
  { code: 'su', emoji: ':flag_id:' },   // Sundanese
  { code: 'sw', emoji: ':flag_tz:' },   // Swahili
  { code: 'sv', emoji: ':flag_se:' },   // Swedish
  { code: 'tg', emoji: ':flag_tj:' },   // Tajik
  { code: 'ta', emoji: ':flag_in:' },   // Tamil
  { code: 'te', emoji: ':flag_in:' },   // Telugu
  { code: 'th', emoji: ':flag_th:' },   // Thai
  { code: 'tr', emoji: ':flag_tr:' },   // Turkish
  { code: 'uk', emoji: ':flag_ua:' },   // Ukrainian
  { code: 'ur', emoji: ':flag_pk:' },   // Urdu
  { code: 'ug', emoji: ':flag_cn:' },   // Uyghur
  { code: 'uz', emoji: ':flag_uz:' },   // Uzbek
  { code: 'vi', emoji: ':flag_vn:' },   // Vietnamese
  { code: 'cy', emoji: ':flag_gb:' },   // Welsh
  { code: 'xh', emoji: ':flag_za:' },   // Xhosa
  { code: 'yi', emoji: ':flag_il:' },   // Yiddish
  { code: 'yo', emoji: ':flag_ng:' },   // Yoruba
  { code: 'zu', emoji: ':flag_za:' }    // Zulu
];

const supportedLanguageCodes = supportedLanguages.map(lang => lang.code);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers, // Add this line
  ],
});


client.on('ready', () => {
  client.user.setPresence({
    activities: [{ name: 'your translations!', type: ActivityType.Listening }],
    status: 'dnd'
});
  console.log(`Logged in as ${client.user.tag}`);
  
});

client.on('messageCreate', async (message) => {
  if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();
  
  if (!command) return;

  if (command === 'translateimg') {
    if (!message.attachments.size) {
      return message.reply('No image attached. Please attach an image for translation.');
    }

    const targetLang = args.shift()?.toLowerCase();
    if (!targetLang || !supportedLanguageCodes.includes(targetLang)) {
      return message.reply(`Invalid or unsupported language code: ${targetLang}`);
    }

    try {
      const attachment = message.attachments.first();
      const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
        lang: 'eng',
      });

      const result = await translate(text, { to: targetLang });

      const translationEmbed = {
        color: 0x0099ff,
        title: 'Image Translation Result',
        fields: [
          { name: `Original Image:`, value: `[View Image](${attachment.url})`, inline: false },
          { name: `Detected Text:`, value: text, inline: false },
          { name: `Translation: ${supportedLanguages.find(lang => lang.code === targetLang)?.emoji || ''}`, value: result.text, inline: false },
        ],
        footer: {
          text: `Translate Bot | Powered by Armour`,
        },
      };

      // message.channel.send({ embeds: [translationEmbed] });
      message.channel.send(`${message.author}, here is your translation from your **[image](${attachment.url})** to ${supportedLanguages.find(lang => lang.code === targetLang)?.emoji || ''}:\n\`\`\`${result.text}\`\`\`\n**Original Image:**\n`);
    } catch (error) {
      console.error('Error during image translation:', error);
      message.reply('An error occurred during image translation. Please try again.');
    }
  } else if (command === 'imgtotext') {
    if (message.attachments.size !== 1) {
      return message.reply('Please attach only one image for text extraction.');
    }

    try {
      const attachment = message.attachments.first();
      const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
        lang: 'eng',
      });

      const textEmbed = {
        color: 0x0099ff,
        title: 'Text Extraction Result',
        fields: [
          { name: `Original Image:`, value: `[View Image](${attachment.url})`, inline: false },
          { name: `Extracted Text:`, value: text, inline: false },
        ],
        footer: {
          text: 'Translate Bot | Powered by Armour',
        },
      };

      // message.channel.send({ embeds: [textEmbed] });
      message.channel.send( `${message.author}, here is the raw text extraction from your **[image](${attachment.url})**:\n\n**\`\`\`${text}\`\`\`**\n\n**Original Image:**\n` );
    } catch (error) {
      console.error('Error during text extraction:', error);
      message.reply('An error occurred during text extraction. Please try again.');
    } 
  } else if (supportedLanguageCodes.includes(command)) {
    const targetLang = command;
    const textToTranslate = args.join(' ');

    try {
      const result = await translate(textToTranslate, { to: targetLang });

      console.log(result);
  
      const fromLanguage = result.from?.language?.iso || 'auto';
      const toLanguage = result.to?.language?.iso || command;
  
      // Find the emoji corresponding to the target language
      const targetLangEmoji = supportedLanguages.find(lang => lang.code === command)?.emoji || '';
  
      console.log(`From: ${textToTranslate}`);
      console.log(`To: ${result.text}`);
      console.log(`Author: ${message.author}`);
  
      const translationEmbed = {
        color: 0x0099ff,
        title: 'Translation Result',
        fields: [
          { name: `Original Text: ${supportedLanguages.find(lang => lang.code === fromLanguage)?.emoji || ''}`, value: textToTranslate, inline: false },
          { name: `Translation: ${targetLangEmoji || ''}`, value: result.text, inline: false },
        ],
        footer: {
          text: `Translate Bot | Powered by Armour`,
        },
      };
  
      // message.channel.send({ embeds: [translationEmbed] });
      message.reply(`${message.author}, here is your translation from ${supportedLanguages.find(lang => lang.code === fromLanguage)?.emoji || ''} to ${supportedLanguages.find(lang => lang.code === toLanguage)?.emoji || ''}:\n**\`\`\`${result.text}\`\`\`**`);
    } catch (error) {
      console.error('Error during translation:', error);
      message.reply('An error occurred during translation. Please try again.');
      console.error('Translation Error Details:', {
        command,
        targetLang: command,
        textToTranslate,
        error: {
          code: error.code,
          message: error.message,
          stack: error.stack,
        },
      });
    }
  } else {
    // Handle invalid or unsupported command
    message.reply(`Invalid command or language code. Please use one of the following commands:\n\n${supportedLanguageCodes}`);
  }
});

client.login(config.token);
