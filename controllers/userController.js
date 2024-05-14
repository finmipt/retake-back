// userController.js
const fetch = require('../fetch');
const { GRAPH_ME_ENDPOINT } = require('../authConfig');
const GRAPH_GROUPS_ENDPOINT = `https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$select=displayName`;
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'yourSecretKey';
const {FRONT_END} = require('../authConfig');
const roleMappings = require('../roleMappings.json')
const menusByRole = require('../menus-by-role.json')

const User = require('../models/User'); // Путь к модели пользователя

// Функция для создания или обновления пользователя
async function createOrUpdateUser(profileData, groupsData) {
    const { id, jobTitle, displayName, userPrincipalName, ...otherFields } = profileData;


    // Map Estonian roles to English
    const role = roleMappings[jobTitle]
    console.log(role)


    // Нахождение всех учебных групп пользователя
    const studentGroups = groupsData.filter(group => group.displayName.match(/\d{2}$/)).map(group => group.displayName);

    // Проверка, существует ли уже пользователь
    let user = await User.findOne({ microsoftId: id });

    if (!user) {
        // Создание нового пользователя, если он не найден
        user = new User({ microsoftId: id, role, name: displayName, email: userPrincipalName, ...otherFields, groups: studentGroups });
        await user.save();
    } else {
        // Обновление существующего пользователя
        const res = await User.updateOne({ microsoftId: id }, {  role:role, name: displayName, email: userPrincipalName, ...otherFields, groups: studentGroups });
    }
    return user;
}

async function getUserGroups(req, res) {
    try {
        const userId = req.params.id;
        const user = await User.findOne({ microsoftId: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} //redo in order to work with _id not microsoftId

async function getId(req, res, next) {
    res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
} //delete

async function getProfile(req, res, next) {
    try {
        const profileData = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken); // Данные профиля


        // Также получаем данные о группах
        const groupsResponse = await fetch(GRAPH_GROUPS_ENDPOINT, req.session.accessToken);
        const groupsData = groupsResponse.value;


        // Создание или обновление пользователя
        await createOrUpdateUser(profileData, groupsData);

        // Отправляем данные профиля на клиент
        res.render('profile', { profile: profileData });
    } catch (error) {
        next(error);
    }
}//delete

async function getData(req, res, next) {
    try {
        console.log('Starting getProfile')
        const profileData = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken); // Данные профиля

        // Также получаем данные о группах
        const groupsResponse = await fetch(GRAPH_GROUPS_ENDPOINT, req.session.accessToken);
        const groupsData = groupsResponse.value;

        // Создание или обновление пользователя
        await createOrUpdateUser(profileData, groupsData);

        // Отправляем данные профиля как JSON на клиент
        res.json({ profile: profileData });
    } catch (error) {
        next(error);
    }
} //delete
async function handleMicrosoftRedirect(req, res) {
    try {
        // Получение данных профиля пользователя
        const profileData = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken);
        const groupsResponse = await fetch(GRAPH_GROUPS_ENDPOINT, req.session.accessToken);
        const groupsData = groupsResponse.value;

        // Создание или обновление пользователя
        const user = await createOrUpdateUser(profileData, groupsData);

        // Создание JWT токена
        const token = jwt.sign({ userId: user._id, role: user.role, email: user.email, isAuthenticated: true }, SECRET_KEY );


        // Установка cookie с JWT
        res.cookie('jwt', 'Bearer ' + token, { httpOnly: false, expiresIn: 3600 });

        // Перенаправление пользователя на фронтенд
        res.redirect(FRONT_END + '/admin');
    } catch (error) {
        console.error('Microsoft Server error:', error);
        res.status(500).send('Server error');
    }
} //here JWT is made

async function getUserRoles(req, res) {
    const role = req.user.role
    res.json(role)
}
async function getMenuItemsForRole(req, res) {
    const role = req.user.role
    const menuItems = menusByRole[role]
    res.json(menuItems)
}
async function getUser (req, res) {
    try {
        const userId = req.user.userId; // Получаем userId из запроса
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        else {
            return res.json(user)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getUserById (req, res) {
    try {
        const userId = req.params.id; // Получаем userId из запроса
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

            else {
                return res.json(user)
            }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.params.id; // Получаем userId из запроса
        const user = await User
            .findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });

        }
        else {
            return res.json(user)
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getId,
    getProfile,
    getUserGroups,
    createOrUpdateUser,
    getData,
    handleMicrosoftRedirect,
    getUser,
    getMenuItemsForRole,
    getUserRoles,
    getUserById,
    deleteUser
};
