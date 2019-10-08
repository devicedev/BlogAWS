const { UserData } = require("@user/data");
const { PostData } = require("@post/data");

module.exports = {
    fromDynamoItemToUserData,
    fromUserDataToDynamoItem,
    fromDynamoItemToPostData,
    fromPostDataToDynamoItem
};

function fromDynamoItemToUserData(dynamoItem) {
    if (!dynamoItem) return undefined;

    return UserData(dynamoItem);
}

function fromUserDataToDynamoItem(userData) {
    const dynamoItem = {};

    Object.keys(userData).forEach(key => {
        if (userData[key] !== "") dynamoItem[key] = userData[key];
    });

    return dynamoItem;
}

function fromDynamoItemToPostData(dynamoItem) {
    if (!dynamoItem) return undefined;

    return PostData(dynamoItem);
}
function fromPostDataToDynamoItem(postData) {
    const dynamoItem = {};

    Object.keys(postData).forEach(key => {
        if (postData[key] !== "") dynamoItem[key] = postData[key];
    });

    return dynamoItem;
}
