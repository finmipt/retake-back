const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;
const processExcelAndGenerateDocuments = require('./cardMaker');
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const adminChatId = process.env.ADMIN_CHAT_ID;

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `*Tere tulemast!* Mina olen Järelevastamise kaartide loomise bot. Saada mulle oma Exceli fail, ja ma aitan sul luua kaarte, mida saab kasutada järelevastamisel.\n` +
        `Kuidas kasutada:\n` +
        `1. Saada mulle Exceli fail, kus on õpilaste nimed, grupid, ülesanded ja õpetaja nimi.\n` +
        `2. Vali asukoht, kus õpe toimub.\n` +
        `3. Ma loon iga lehekülje jaoks dokumendi ja saadan sulle valmis failid.\n\n` +
        `Kasuta käsku /help, et saada rohkem teavet või abi kasutamisel.`;
    bot.sendMessage(chatId, welcomeMessage);
});

const userSessions = {};

bot.on('document', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const fileId = msg.document.file_id;
    const fileName = msg.document.file_name; // Получаем имя файла из сообщения

    // Проверяем расширение файла
    if (!fileName.endsWith('.xlsx')) {
        bot.sendMessage(chatId, 'Palun laadi üles ainult Exceli failid (.xlsx formaadis).');
        return;
    }

    try {
        const filePath = await bot.downloadFile(fileId, 'downloads');
        bot.sendMessage(chatId, 'Fail laeti alla: ' + filePath);
        bot.sendMessage(chatId, 'Vali õppekoht', {
            reply_markup: { keyboard: [['Narva', 'Jõhvi', 'Sillamäe']], one_time_keyboard: true, resize_keyboard: true }
        });

        // Сохраняем информацию о сессии пользователя
        userSessions[userId] = {
            filePath: filePath,
            awaitingLocation: true,
            awaitingMaterials: false
        };

    } catch (error) {
        console.error('Error in document handling:', error);
        bot.sendMessage(chatId, 'Viga dokumendi töötlemisel.');
    }
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    // Проверяем, ждем ли мы выбор местоположения от этого пользователя
    if (userSessions[userId] && userSessions[userId].awaitingLocation) {
        // Обновляем сессию пользователя
        userSessions[userId].awaitingLocation = false;
        userSessions[userId].location = text;
        userSessions[userId].awaitingMaterials = true;
        bot.sendMessage(chatId, 'Vali materjalid', { reply_markup: { keyboard: [['Pole'],['Vihikud','Vihikud, kalkulaator']], one_time_keyboard: true, resize_keyboard: true } })
    }
    else if (userSessions[userId] && userSessions[userId].awaitingMaterials) {
        userSessions[userId].awaitingMaterials = false;
        userSessions[userId].materials = text;

        try {
            // Теперь можно обработать документ
            const filePath = userSessions[userId].filePath;
            const location = userSessions[userId].location;
            const materials = userSessions[userId].materials;
            const cardsDocument = await processExcelAndGenerateDocuments(filePath, location, materials, userId);

            if (cardsDocument) {
                await bot.sendDocument(chatId, cardsDocument);
                console.log('Document sent successfully');
                bot.sendMessage(adminChatId, `Document sent to user ${userId}`);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log(`${filePath} deleted successfully`);
                    }
                });
            } else {
                bot.sendMessage(chatId, 'Document processing failed.');
                bot.sendMessage(adminChatId, `Document processing failed for user ${userId}`);
            }

            // Удаляем информацию о сессии после обработки
            delete userSessions[userId];

        } catch (error) {
            console.error('Error processing document:', error);
            bot.sendMessage(chatId, 'Failed to process document.');
            bot.sendMessage(adminChatId, `Error processing document for user ${userId}`);
        }
    }
});

module.exports = bot;