const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require('../../responses');
const { validateToken } = require('../middleware/auth');
import middy from "@middy/core";

const getNotes = async (event, context) => {

  if (event?.error && event?.error === '401')
    return sendResponse(401, {success: false , message: 'Invalid token' });

  const {Items} = await db.scan({
    TableName: 'myNotesTable', 
    FilterExpression: "attribute_exists(#id)",
    ExpressionAttributeNames: {
      "#id" : "id"
    }
  }).promise();

  return sendResponse(200, {success : true, notes : Items});
}

const handler = middy(getNotes)
  .use(validateToken)
  

module.exports = { handler };