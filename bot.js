const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const prefix = '!';

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
    const supportedLanguageCodes = supportedLanguages.map(lang => lang.code);
    if (!supportedLanguageCodes.includes(targetLang)) {
      return message.reply(`The language '${targetLang}' is not supported.`);
    }

    try {
      const result = await translate(textToTranslate, { to: targetLang });

      console.log(result);

      const fromLanguage = result.from?.language?.iso || 'auto';
      const toLanguage = result.to?.language?.iso || targetLang;

      // Find the emoji corresponding to the target language
      const targetLangEmoji = supportedLanguages.find(lang => lang.code === targetLang)?.emoji || '';

      const translationEmbed = {
        color: 0x0099ff,
        title: 'Translation Result',
        fields: [
          { name: `Original Text: ${supportedLanguages.find(lang => lang.code === fromLanguage)?.emoji || ''}`, value: textToTranslate, inline: false },
          { name: `Translation: ${supportedLanguages.find(lang => lang.code === toLanguage)?.emoji || ''}`, value: result.text, inline: false },
          // {name: `From:`, value: `${fromLanguage} ${supportedLanguages.find(lang => lang.code === fromLanguage)?.emoji || ''}`}, 
          // {name: `To:`, value: `${toLanguage} ${targetLangEmoji}`},
        ],
        footer: {
          text: `Translate Bot | Powered by Armour`,
        },
      };

      message.channel.send({ embeds: [translationEmbed] });
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
