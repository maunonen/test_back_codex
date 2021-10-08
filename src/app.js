const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const middleware = require('./utils/middleware/middleware');
const songsRouter = require('./routers/songs');
const authorsRouter = require('./routers/authors');
const {sequelize} = require('../models/index');


async function main() {
    await sequelize.sync({
        force: true
    });
}

main();


app.use(bodyParser.json())

// set yours ip address of front
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(middleware.reqLogger);
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError &&
        err.status >= 400 && err.status < 500 &&
        err.message.indexOf('JSON')) {
        res.status(400).send({error: "Invalid JSON Object"})
    } else {
        next();
    }
});
app.use('/api/songs', songsRouter);
app.use('/api/authors', authorsRouter);

module.exports = app