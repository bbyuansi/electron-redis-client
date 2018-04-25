const options = require('./servers');
const redis = require('redis');

function getDefaultServer() {
    for (let opt in options) {
        if (options[opt] && options[opt]['default']) {
            return options[opt];
        }
    }
    return null;
}

function getAllServers() {
    return options;
}

function appendOptionToServers(opt) {
    options.push(opt);
    return options;
}

function connectRedis(opt) {
    if (!opt.password) {
        return redis.createClient({host: opt.host, port: opt.port});
    }
    return redis.createClient({host: opt.host, port: opt.port, password: opt.password});
}

function getDBKeysCounts(client, db = 0) {
    client.select(db, (err) => {
        if (err) throw err;
        return client.keys((err, count) => {
            console.log(count);
        })
    })
}

function getAllKeys(client, db = 0, fn) {
    client.select(db, (err) => {
        if (err) throw err;
        client.keys('*', (err, keys) => {
            if (err) throw err;
            fn(keys);
        })
    })
}

module.exports = {getDefaultServer, getAllServers, appendOptionToServers, connectRedis, getAllKeys, getDBKeysCounts};

