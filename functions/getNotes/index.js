const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const middy = require('@middy/core');
const { authMiddleware } = require('./authMiddleware');


exports.handler = async (event, context) => {
    const userId = event.requestContext.authorizer.principalId;

    const params = {
        TableName: 'myNotesTable',
        KeyConditionExpression: 'userId = :uid', 
        ExpressionAttributeValues: {
          ':uid': event.requestContext.authorizer.principalId
        }
    }
}

try {
    const data = await dynamoDB.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not fetch notes.' })
    };
  }

  module.exports.handler = middy(getNotesHandler).use(authMiddleware());