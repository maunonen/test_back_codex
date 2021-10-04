const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const middleware = require('./utils/middleware/middleware')
const songsRouter = require('./routers/songs')
const authorsRouter = require('./routers/authors')


app.use(bodyParser.json())

// allowed react app on port 3000 using router
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(middleware.reqLogger);

app.use('/api/songs', songsRouter );
app.use('/api/authors', authorsRouter );

module.exports = app