const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require('../../responses');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event, context) => {
  const note = JSON.parse(event.body);

  const timestamp = new Date().getTime();
  const dateNow = new Date().getUTCDate();

  const uniqueId = uuidv4();


  note.uid = uniqueId;
  note.id = `${timestamp}`;
  note.date = `${dateNow}`;


  try {
      await db.put({
          TableName: 'myNotesTable',
          Item: note
      }).promise()

      return sendResponse(200, {success: true});
  } catch (error) {
      console.error('DynamoDB put error:', error);
      return sendResponse(500, {success: false});
  }
}