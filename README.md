# google-translate-discordbot
A simple Discord Bot that utilises Google Translate and Tesseract API to translate any piece of text, or text within an image, to a chosen language.

# Installation:
1. Clone the repository to your machine using `git clone https://github.com/BrazyDevelopment/google-translate-discordbot.git`
2. Run `npm install` to install the dependencies.
3. Change `config.template.json` to `config.json` and configure it to your needs.
4. Don't forget to include your Discord bot token from Discord Developer Portal.
5. Run `node bot.js` to start the bot.

# Usage:
## Translate Text to any ISO-693 language code.
## `!translate <languagecode> <text>` i.e. `!translate fr Hello, how are you?`.

## Translate Text within an Image to any ISO-693 language code.
### `!translateimg <languagecode>` i.e. `!translate en` with your image attached.

## Convert Text within an image to Raw Text.
### `!imgtotext` with your image attached.