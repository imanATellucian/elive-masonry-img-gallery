// ESM imports made possible by serverless-bundle plugin defined in serverless.yml
// if you are building a lambda without this plugin, you'll have to use commonJs syntax
import { StatusCodes } from 'http-status-codes';
import {memes} from './memes';


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
    "Access-Control-Allow-Headers" : "Content-Type",
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

        const {httpMethod} = event;
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
                    const keys = Object.keys(memes);
                    let data = keys;
                    if (category && keys.indexOf(category) > -1) {
                        console.log("yes");
                        data = memes[category];
                    }
                    else if (category && category === 'random') {
                        const randomCategory = keys[Math.floor(Math.random() * keys.length)];
                        const randomMeme = memes[randomCategory][Math.floor(Math.random() * memes[randomCategory].length)];
                        data = {
                            category: randomCategory,
                            meme: randomMeme
                        };
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
