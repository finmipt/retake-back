const User = require('../models/User');

const employeeRoles = ['teacher', 'admin', 'manager', 'director'];

async function getEmployees(req, res) {
    try {
        const employees = await User.find({ role: { $in: employeeRoles } });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getEmployees
};