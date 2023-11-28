const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();


exports.handler = async (event, context) => {
    const { title, text } = JSON.parse(event.body); 

    
    const userId = event.requestContext.authorizer.principalId; 
  
    const params = {
      TableName: 'myNotesTable',
      Item: {
        userId: userId, 
        id: Math.random().toString(36).substring(2), 
        title: title,
        text: text,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      }
    };
  
    try {
      await dynamoDB.put(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Note created successfully.' })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Could not create note.' })
      };
    }
  };