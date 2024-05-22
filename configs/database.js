const { MongoClient } = require('mongodb');

let connection;

const connect = async (cb) => {
    const config = {
        'protocol': 'mongodb',
        'host': 'mongo',
        'port': '27017',
        'db': 'application'
    };
    
    try {
        const client = await MongoClient.connect(`${config.protocol}://${config.host}:${config.port}/${config.db}`);
        
        connection = client.db()

        return cb()
    } catch (error) {
        return cb(error)
    }
};

const getDB = () => connection;

module.exports = {
    connect,
    getDB
}