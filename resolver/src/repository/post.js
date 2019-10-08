const DynamoDB = require("aws-sdk/clients/dynamodb");

const {
    fromDynamoItemToPostData,
    fromPostDataToDynamoItem
} = require("./utils/mapper");

const Region = process.env.REGION;

const TableName = process.env.POST_TABLE_NAME;

const dynamo = new DynamoDB.DocumentClient({ Region });

module.exports = {
    savePost,
    retrievePost,
    retrieveUserPosts,
    removePost
};

async function savePost(postData) {
    try {
        const params = {
            TableName,
            Item: fromPostDataToDynamoItem(postData)
        };

        global.logInfo("dynamo.savePost", params);

        await dynamo.put(params).promise();
    } catch (err) {
        global.logError("dynamo.savePost", err);

        throw err;
    }
}

async function retrievePost(userId, postId) {
    try {
        const params = {
            TableName,
            Key: {
                id: postId,
                userId
            }
        };

        global.logInfo("dynamo.retrievePost", params);

        const data = await dynamo.get(params).promise();

        return fromDynamoItemToPostData(data.Item);
    } catch (err) {
        global.logError("dynamo.retrievePost", err);

        throw err;
    }
}

async function retrieveUserPosts(userId) {
    try {
        const params = {
            TableName,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        global.logInfo("dynamo.retrieveUserPosts", params);

        const posts = await dynamo.query(params).promise();

        return posts.Items.map(item => fromDynamoItemToPostData(item));
    } catch (err) {
        global.logError("dynamo.retrieveUserPosts", err);

        throw err;
    }
}

async function removePost(userId, postId) {
    try {
        const params = {
            TableName,
            Key: {
                userId,
                id: postId
            }
        };

        global.logInfo("dynamo.removePost", params);

        return await dynamo.delete(params).promise();
    } catch (err) {
        global.logError("dynamo.removePost", err);

        throw err;
    }
}
