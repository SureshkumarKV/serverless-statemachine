/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

/**
 * Interface lambda to add a new state machine.
 * 
 * @param {Object} event - API Gateway Lambda Proxy Input object.
 * @param {Object} context - Lambda context object.
 * @returns {Object} object - API Gateway Lambda Proxy Output object
 */
exports.handler = async (event, context) => {

    try {
        // Add a flag indicating termination request.
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                id: event.pathParameters.id
            },
            UpdateExpression: 'set #removing = :removing',
            ExpressionAttributeNames: {
                '#removing': 'removing'
            },
            ExpressionAttributeValues: {
                ':removing': true
            }
        };

        const data = await documentClient.update(params).promise();

        // Return success.
        const response = {
            statusCode: 202,
            body: JSON.stringify(data.Attributes),
        };
        return response;


    } catch (error) {
        console.log(error);

        // Return 500.
        const response = {
            statusCode: 500,
            body: JSON.stringify(error)
        };
        return response;
    }

};
