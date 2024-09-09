const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '7206062475:AAG4ItlHABINkstHuXHjIUTieRMBaOPHzlk';

const bot = new TelegramApi(token, {polling: true})

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 0 до 9, а ты должен его угадать`);
    const randomNumber = String(Math.floor(Math.random() * 10));
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Проверка'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Поиграем в игру?'},
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start') {
            return bot.sendMessage(chatId, `Добро пожаловать в мой первый бот`);
        }
        
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }

        if (text === '/game') {
           return startGame(chatId);
        }
        return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if(data === '/again') {
            startGame(chatId);
        }

        if(data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start();