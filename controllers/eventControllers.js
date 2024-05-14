const Event = require('../models/Event');

async function createEvent(req, res) {
    try {
        // Преобразование даты события из строки в объект Date
        const eventDate = new Date(req.body.date);

        // Вычисление даты начала регистрации, вычитая количество дней из даты события
        const registrationOpenDate = new Date(eventDate);
        registrationOpenDate.setDate(eventDate.getDate() - req.body.registrationOpens);

        // Вычисление даты закрытия регистрации, добавляя количество дней к дате события
        const registrationCloseDate = new Date(eventDate);
        registrationCloseDate.setDate(eventDate.getDate() - req.body.registrationCloses);

        // Создание нового события с преобразованными датами
        const event = new Event({
            ...req.body,
            date: eventDate, // Устанавливаем преобразованную дату события
            registrationOpens: registrationOpenDate, // Устанавливаем дату открытия регистрации
            registrationCloses: registrationCloseDate, // Устанавливаем дату закрытия регистрации
            createdOn: new Date() // Установка текущей даты как даты создания события
        });

        await event.save(); // Сохранение события в базе данных
        res.status(201).json(event); // Отправка созданного события обратно клиенту
    } catch (error) {
        res.status(500).json({ error: error.message }); // Отправка сообщения об ошибке, если что-то пошло не так
    }
}

async function getEvents(req, res) {
    try {
        const events = await Event.find(); // Получение всех событий из базы данных
        res.json(events); // Отправка всех событий обратно клиенту
    } catch (error) {
        res.status(500).json({ error: error.message }); // Отправка сообщения об ошибке, если что-то пошло не так
        console.log(error.message);
    }
}
async function getEventById(req, res) {
    try {
        const event = await Event.findById(req.params.id);
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getLocationsByEventId(req, res) {
    try {
        const locations = await Event.findById(req.params.event_id, 'locations');
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateEvent(req, res) {
    try {
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteEvent(req, res) {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    getLocationsByEventId,
    updateEvent,
    deleteEvent
};