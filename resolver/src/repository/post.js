const DynamoDB = require('aws-sdk/clients/dynamodb');


const {
    fromDynamoItemToPostData,
    fromPostDataToDynamoItem
} = require('./utils/mapper');

const Region = process.env.REGION;

const TableName = process.env.POST_TABLE_NAME;

const dynamo = new DynamoDB.DocumentClient({Region});

module.exports = {
    savePost,
    getAllPosts,
    getPost,
    getUserPosts,
    updatePost,
    deletePost
};

async function savePost(postData) {
    try {
        const params = {
            TableName,
            Item: fromPostDataToDynamoItem(postData)
        };

        global.logInfo('dynamo.savePost', params);

        await dynamo.put(params).promise();

    } catch (err) {
        global.logError('dynamo.savePost', err);

        throw err;
    }
}

async function getAllPosts() {
    try {
        const params = {
            TableName,
            KeyConditionExpression: 'draft = :draft',
            ExpressionAttributeValues: {
                ':draft': false
            }
        };

        global.logInfo('dynamo.getAllPosts', params);

        const posts = await dynamo.query(params).promise();

        return posts.Items.map((item) => fromDynamoItemToPostData(item));

    } catch (err) {
        global.logError('dynamo.getAllPosts', err);

        throw err;
    }
}

async function getPost(postId) {
    try {
        const params = {
            TableName,
            Key: {
                id: postId
            }
        };

        global.logInfo('dynamo.getPost', params);

        const post = await dynamo.get(params).promise();

        return fromDynamoItemToPostData(post);

    } catch (err) {
        global.logError('dynamo.getPost', err);

        throw err;
    }
}

async function getUserPosts(userId) {
    try {
        const params = {
            TableName,
            Key: {
                userId
            }
        };

        global.logInfo('dynamo.getUserPosts', params);

        const posts = await dynamo.get(params).promise();

        return posts.Items.map((item) => fromDynamoItemToPostData(item));

    } catch (err) {
        global.logError('dynamo.getUserPosts', err);

        throw  err;
    }
}

async function updatePost(postId) {
    try {
        const params = {
            TableName,
            Key: {
                id: postId
            }

        };

        global.logInfo('dynamo.updatePost', params);

    } catch (err) {
        global.logError('dynamo.updatePost', err);

        throw err;
    }
}
async function deletePost(postId) {


}