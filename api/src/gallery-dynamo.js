// ESM imports made possible by serverless-bundle plugin defined in serverless.yml
// if you are building a lambda without this plugin, you'll have to use commonJs syntax
import { StatusCodes } from 'http-status-codes';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: 'est-image-gallery'
};

/*
async function listItems() {
    try {
        // Warning: node aws-sdk's "scan" function will return paged
        // results when data exceeds 2M so if your table exceeds certain
        // limits you may need to accomodate paging
        const data = await docClient.scan(params).promise();
        return data;
    } catch (err) {
        return err;
    }
}
*/

async function itemsByAlbum(album) {
    const queryParam = Object.assign(params, {
        KeyConditionExpression: '#name = :value',
        ExpressionAttributeValues: { ':value': album },
        ExpressionAttributeNames: { '#name': 'album' }
    });
    try {
        const data = await docClient.query(queryParam).promise();
        return data;
    } catch (err) {
        return err;
    }
}

const buildResponse = ({ statusCode, headers, body }) => {
    const response = {
        statusCode: statusCode,
        headers: Object.assign({}, headers)
    };

    if (body) {
        response.body = JSON.stringify(body);
    }

    return response;
};

let allHeaders = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "https://*.elluciancloud.com",
    'Access-Control-Allow-Credentials': true,
    "Access-Control-Allow-Methods": "OPTIONS,GET"
};

export const handler = (event, context, callback) => {
    console.log("i'm here", event);
    try {
        const {
            headers: {
                'access-control-request-headers': accessControlRequestHeaders,
                'access-control-request-method': accessControlRequestMethod,
                origin = "http://localhost"
            }
        } = event;


        if (origin.match(/(elluciancloud.com$)|(http:\/\/localhost)/)) {
            allHeaders = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': accessControlRequestHeaders,
                'Access-Control-Allow-Method': accessControlRequestMethod,
                'Access-Control-Allow-Methods': 'OPTIONS, GET'
            };
        }

        if (process.env.DEBUG === true) {
            console.log(event);
        }

        const { httpMethod } = event;
        console.log('httpMethod ', httpMethod);
        switch (httpMethod) {
            case 'OPTIONS':
                // cors
                callback(null, buildResponse({
                    statusCode: StatusCodes.OK,
                    body: {},
                    headers: allHeaders
                }));
                break;
            case 'GET':
                (async () => {
                    const category = event.pathParameters ? event.pathParameters.category : null;
                    console.log("category", category);
                    try {
                        let data = await itemsByAlbum('memes');
                        let categories = [];
                        let imagesByCategory = {};
                        if (data && data.Items) {
                            console.log(data);
                            data.Items.forEach( item => {
                                item.tags.forEach( tag => {
                                    if(categories.indexOf(tag) == -1){
                                        // this is the first time we've encountered this category
                                        // so we'll add it to the category array
                                        // and initialize the key on imgsByCategory
                                        categories.push(tag);
                                        imagesByCategory[tag] = [];
                                    }
                                    imagesByCategory[tag].push(item.imageUrl);
                                });
                            });
                            console.log("categories", categories);
                        }
                        switch(category) {
                            case 'categories':
                                callback(null, buildResponse({
                                    statusCode: StatusCodes.OK,
                                    body: categories,
                                    requestHeaders: event.headers,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }));
                            break;
                            default:
                                callback(null, buildResponse({
                                    statusCode: StatusCodes.OK,
                                    body: imagesByCategory,
                                    requestHeaders: event.headers,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }));
                            break;
                        }
                    } catch (error) {
                        console.log(`GET error: ${JSON.stringify(error)}`);
                        callback(null, buildResponse({
                            statusCode: parseInt(error.code) || StatusCodes.BAD_REQUEST,
                            body: {
                                error: error.message || error.toString(0)
                            },
                            headers: allHeaders
                        }));
                    }
                })();
                break;

            default:
                callback(null, buildResponse({
                    statusCode: StatusCodes.StatusCodes.BAD_REQUEST,
                    body: {
                        error: 'Unsupported http method ' + httpMethod
                    },
                    headers: allHeaders
                }));
                break;
        }
    } catch (ex) {
        console.log('Exception: ' + JSON.stringify(ex));
        // eventLog.logInboundEvent(event);

        callback(null, buildResponse({
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR
        }));
    }
};
