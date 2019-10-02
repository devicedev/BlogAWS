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

        await dynamo.put(params).promise();

    } catch (err) {
        //logging
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

        return fromDynamoItemToUserData(data.Item);

    } catch (err) {
        //logging
        throw err;

    }

}

async function getAllUsers() {
    try {

        const params = {
            TableName
        };

        const data = await dynamo.scan(params).promise();

        return data.Item.map((item) => fromDynamoItemToUserData(item))

    } catch (err) {
        //logging
        throw err;
    }
}