import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client.js';
import { sendResponse } from '../../responses/index.js';
import { validateToken } from '../middleware/auth.js';
import middy from "@middy/core";

const getNotes = async (event, context) => {

  if (event?.error && event?.error === '401')
    return sendResponse(401, {success: false , message: 'Invalid token' });

  const {Items} = await db.scan({
    TableName: 'myNotesTable', 
  }).promise();

  return sendResponse(200, {success : true, notes : Items});
}

const handler = middy(getNotes)
  .use(validateToken)
  

module.exports = { handler };