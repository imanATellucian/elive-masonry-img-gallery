// ESM imports made possible by serverless-bundle plugin defined in serverless.yml
// if you are building a lambda without this plugin, you'll have to use commonJs syntax
import { StatusCodes } from 'http-status-codes';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: 'est-image-gallery'
};
// AWS lambda docs used:
// * https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/
// * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property

/*
async function listItems() {
    try {
        // Warning: node aws-sdk's "scan" function will return paged
        // results when data exceeds 2M so if your table exceeds certain
        // limits you may need to accomodate paging
        // I decided to use the query function instead of scan for this reason
        // but will leave this here as a demo
        const data = await docClient.scan(params).promise();
        return data;
    } catch (err) {
        return err;
    }
}
*/

// Pro tip:  All docs will show calls to the aws-sdk in try/catch blocks
// however when working with lambdas you only want one try catch block
// at the parent level so it's easier to debug
async function itemsByAlbum(album) {
    const queryParam = Object.assign(params, {
        KeyConditionExpression: '#name = :value',
        ExpressionAttributeValues: { ':value': album },
        ExpressionAttributeNames: { '#name': 'album' }
    });
    const data = await docClient.query(queryParam).promise();
    return data;
}

async function saveItem(newItem) {
    const putParams = Object.assign(params, {
        Item: newItem
    });
    await docClient.put(putParams).promise();
    return putParams;
};

async function buildCategoriesAndAlbum() {
    const data = await itemsByAlbum('memes');
    let categories = [];
    let imagesByCategory = {};
    if (data && data.Items) {
        console.log(data);
        data.Items.forEach(item => {
            item.tags.forEach(tag => {
                if (categories.indexOf(tag) == -1) {
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
    return { categories, imagesByCategory };
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
                'Access-Control-Allow-Methods': 'OPTIONS, GET, POST'
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
                        const { categories, imagesByCategory } = await buildCategoriesAndAlbum();
                        let data;
                        if (category == 'categories') {
                            data = categories;
                        }
                        else {
                            data = imagesByCategory;
                        }
                        callback(null, buildResponse({
                            statusCode: StatusCodes.OK,
                            body: data,
                            requestHeaders: event.headers,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }));
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
            case 'POST':
                (async () => {
                    // decode and destructure post body into expected keys
                    const { album = "memes", imageUrl = "", tags = [] } = JSON.parse(event.body);
                    if (imageUrl.length == 0 || tags.length == 0) {
                        // invalid input, throw it back
                        callback(null, buildResponse({
                            statusCode: StatusCodes.BAD_REQUEST,
                            body: JSON.stringify({
                                error: 'missing required parameter'
                            })
                        }));
                    } else {
                        // dynamo has no enforced schema other than the Hash and Range
                        // that make up the composite primary key so you need to
                        // enforce schema definitions prior to committing
                        const screenedItem = {
                            album,
                            imageUrl,
                            tags
                        };
                        try {
                            const putItem = await saveItem(screenedItem);
                            console.log("saved: ", putItem);
                            callback(null, buildResponse({
                                statusCode: StatusCodes.OK,
                                body: screenedItem,
                                requestHeaders: event.headers,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }));
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
