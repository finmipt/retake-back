const mongoose = require('mongoose');
const User = require('./User'); // Путь к вашей модели пользователя
require('dotenv').config();

// Подключение к MongoDB
const mongoDB= "mongodb+srv://retakeUser:61IS7RrTMpZQQ3IR@retakecluster.cg2cjwx.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect( mongoDB );

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', async function() {
    console.log("Успешное подключение к MongoDB ");

    // Создание тестового пользователя
    const testUser = new User({
        id: 'test_user_id',
        email: 'test@example.com',
        role: 'tester',
        name: 'Test User',
        additional_info: {
            someKey: 'someValue'
        }
    });

    try {
        await testUser.save();
        console.log('Тестовый пользователь успешно добавлен');
    } catch (err) {
        console.error('Ошибка при сохранении тестового пользователя:', err);
    }

    // Закрытие соединения с базой данных
    db.close();
});
