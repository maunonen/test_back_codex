const app = require('./app')
const {sequelize} = require('../models/index');

const port = process.env.PORT


app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    console.log('Server is running', port)
})
