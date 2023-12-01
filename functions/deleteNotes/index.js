const AWS = require('aws-sdk');
const middy = require('@middy/core');
const { sendResponse } = require('../../responses');
const { validateToken } = require('../../middleware/auth');

const db = new AWS.DynamoDB.DocumentClient();

const deleteNote = async (event, context) => {
  const noteId = event.pathParameters.noteId;

  const params = {
    TableName: 'myNotesTable',
    Key: {
      id: noteId
    }
  };

  try {
    await db.delete(params).promise();
    return sendResponse(200, { success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('DynamoDB delete error:', error);
    return sendResponse(500, { success: false, message: 'Unable to delete the post' });
  }
};

const handler = middy(deleteNote).use(validateToken);

module.exports = { handler };