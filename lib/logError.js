function logError(res, err) {
    res.status(500).send({error: 'Unexpected Error: ' + err});
    throw err;
}

module.exports = logError;

