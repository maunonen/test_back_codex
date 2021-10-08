/*const logger = require('logger')*/

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
    logger.error(error.message)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({
            error: 'malformed id'
        })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({error: error.message})
    }
    next(error)
}

module.exports = {
    reqLogger, errorHandler,
}