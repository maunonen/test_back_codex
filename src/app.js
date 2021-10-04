const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const middleware = require('./utils/middleware/middleware');
const songsRouter = require('./routers/songs');
const authorsRouter = require('./routers/authors');
const {sequelize} = require('../models/index');


/*async function main() {
    await sequelize.sync({
        force: true
    });
}

main();*/


app.use(bodyParser.json())

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(middleware.reqLogger);

app.use('/api/songs', songsRouter);
app.use('/api/authors', authorsRouter);

module.exports = app