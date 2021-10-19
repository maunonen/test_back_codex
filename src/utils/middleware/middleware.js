const logger = require('logger')
const {ValidationError} = require('sequelize');

const reqLogger = (req, res, next) => {
    console.log("Time: ", new Date().toString());
    console.log("-----", req.method, req.url, "params:", req.params);
    console.log("query:", req.query);
    console.log("body:", req.body);
    console.log("cookies:", req.cookies);
    const parseIp = (req) => (
        (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.socket.remoteAddress
    )
    console.log('ip address', parseIp(req));
    next()
}


const errorHandler = (error, req, res, next) => {
    /*console.log('Error object', error);
    console.dir(error);
    console.log('Error Kind', error.kind);
    console.log('Error name', error.name);
    console.log('Error Message', error.message);
    console.log('Error type Message', error.type);
    console.log('Error object', JSON.stringify(error.error));
    console.error('From handler', error);*/
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({
            error: 'malformed id'
        })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({error: error.message})
    } else if (error instanceof ValidationError ) {
        return res.status(400).json({error: error.message})
    }else if (error instanceof TypeError) {
        return res.status(400).json({error: error.message})
    }
    else {
        return res.status(500).json({ error : error.message})
    }
    next(error)
}

module.exports = {
    reqLogger, errorHandler,
}