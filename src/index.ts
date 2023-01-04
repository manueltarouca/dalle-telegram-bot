import { Configuration, OpenAIApi } from 'openai';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));
const bot = new TelegramBot(process.env.TG_API_TOKEN!, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  if (msg.text?.startsWith('/generate')) {
    bot.sendMessage(chatId, 'Received your message');
    const messagePrompt = msg.text.split('/generate ')[1];
    console.log(`prompt is: ${messagePrompt}`);
    const generated = await openai.createImage({ prompt: messagePrompt });
    console.log(generated.data.data[0].url);
    const response = await axios.get(generated.data.data[0].url!, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, "utf-8");
    bot.sendPhoto(chatId, buffer);
  }
});