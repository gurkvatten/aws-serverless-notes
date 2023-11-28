const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();


exports.handler = async (event, context) => {
    const noteId = event.pathParameters.noteId; 

    const { title, text } = JSON.parse(event.body); 
  
    
    const userId = event.requestContext.authorizer.principalId; 
  
    const params = {
      TableName: 'myNotesTable',
      Key: {
        userId: userId, 
        id: noteId
      },
      UpdateExpression: 'SET #t = :title, #txt = :text, #mod = :modified',
      ExpressionAttributeNames: {
        '#t': 'title',
        '#txt': 'text',
        '#mod': 'modifiedAt'
      },
      ExpressionAttributeValues: {
        ':title': title,
        ':text': text,
        ':modified': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW' 
    };
  
    try {
      const data = await dynamoDB.update(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify(data.Attributes)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Could not update note.' })
      };
    }
  };