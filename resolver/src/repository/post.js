const DynamoDB = require('aws-sdk/clients/dynamodb');


const {
    fromDynamoItemToPostData,
    fromPostDataToDynamoItem
} = require('./utils/mapper');

const Region = process.env.REGION;

const TableName = process.env.POST_TABLE_NAME