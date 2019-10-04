const DynamoDB = require('aws-sdk/clients/dynamodb');


const {
    fromDynamoItemToUserData,
    fromUserDataToDynamoItem
} = require('./utils/mapper');

const region = process.env.REGION;

const TableName = process.env.USER_TABLE_NAME;

const dynamo = new DynamoDB.DocumentClient({region});

module.exports = {
    saveUser,
    getUser,
    getAllUsers
};

async function saveUser(userData) {
    try {
        const params = {
            TableName,
            Item: fromUserDataToDynamoItem(userData)
        };

        global.logInfo('dynamo.saveUser', params);

        await dynamo.put(params).promise();

    } catch (err) {
        global.logError('dynamo.saveUser', err);

        throw err;
    }
}

async function getUser(userId) {
    try {
        const params = {
            TableName,
            Key: userId
        };

        const data = await dynamo.get(params).promise();

        global.logInfo('dynamo.getUser', params);

        return fromDynamoItemToUserData(data.Item);

    } catch (err) {
        global.logError('dynamo.getUser', err);

        throw err;
    }
}

async function getAllUsers() {
    try {
        const params = {
            TableName
        };

        const data = await dynamo.scan(params).promise();

        global.logInfo('dynamo.getAllUsers', params);

        return data.Item.map((item) => fromDynamoItemToUserData(item))

    } catch (err) {
        global.logError('dynamo.getAllUsers', err);

        throw err;
    }
}