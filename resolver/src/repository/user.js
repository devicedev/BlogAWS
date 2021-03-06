const DynamoDB = require("aws-sdk/clients/dynamodb");

const {
    fromDynamoItemToUserData,
    fromUserDataToDynamoItem
} = require("./utils/mapper");

const region = process.env.REGION;

const TableName = process.env.USER_TABLE_NAME;

const dynamo = new DynamoDB.DocumentClient({ region });

module.exports = {
    saveUser,
    retrieveUser,
    retrieveAllUsers
};

async function saveUser(userData) {
    try {
        const params = {
            TableName,
            Item: fromUserDataToDynamoItem(userData)
        };

        global.logInfo("dynamo.saveUser", params);

        await dynamo.put(params).promise();
    } catch (err) {
        global.logError("dynamo.saveUser", err);

        throw err;
    }
}

async function retrieveUser(userId) {
    try {
        const params = {
            TableName,
            Key: {
                id: userId
            }
        };

        const data = await dynamo.get(params).promise();

        global.logInfo("dynamo.retrieveUser", params);

        return fromDynamoItemToUserData(data.Item);
    } catch (err) {
        global.logError("dynamo.retrieveUser", err);

        throw err;
    }
}

async function retrieveAllUsers() {
    try {
        const params = {
            TableName
        };

        const data = await dynamo.scan(params).promise();

        global.logInfo("dynamo.retrieveAllUsers", params);

        return data.Items.map(item => fromDynamoItemToUserData(item));
    } catch (err) {
        global.logError("dynamo.retrieveAllUsers", err);

        throw err;
    }
}
