
// We would have to use commonJS requires if we weren't using the serverless-bundle plugin
// which is what is letting us use ESM syntax here
// const { StatusCodes } = require('http-status-codes');
// const jwt = require('jsonwebtoken');
import { StatusCodes } from 'http-status-codes';
import Jwt from 'jsonwebtoken';


const shared_secret = process.env.JWT_SECRET;


function generatePolicy (jwtDecoded, effect, resource) {
    const authResponse = {};

    authResponse.principalId = jwtDecoded.user.id;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    // context values have to be flattened for AWS API Gateway Authorizer
    const context = {};
    context.personId = jwtDecoded.sub;
    context.erpId = jwtDecoded.user.erpId;
    context.roles = jwtDecoded.user.roles.join();
    context.cardId = jwtDecoded.card.id;
    context.cardServerConfigurationApiUrl = jwtDecoded.card.cardServerConfigurationApiUrl;
    context.tenantId = jwtDecoded.tenant.id;
    authResponse.context = context;
    // these will be available in the "business lambda" under event using their context names

    if (process.env.DEBUG === 'true') {
        console.log('generatePolicy: ', authResponse);
    }
    return authResponse;
}

// pulls the JWT from the authroization token, verifies it, if valid generates a policy with user info in the context
//export default (event, context, callback) {
export const handler = (event, context, callback) => {
    if (process.env.DEBUG === 'true') {
        console.log('authorizer event: ' + JSON.stringify(event));
    }

    if (event.authorizationToken) {
        // get token minus 'bearer '
        const token = event.authorizationToken.substring(7);
        if (process.env.DEBUG === 'true') {
            console.log('token: ', token);
        }
        const options = {
            algorithms: ['HS256'],
            ignoreExpiration: process.env.IGNORE_JWT_EXPIRATION === 'true'
        };
        try {
            // verify throws an error if token decryption fails or token is expired
            // and ignoreExpiration is not true, so it must be done in a try/catch
            const jwtDecoded = Jwt.verify(token, shared_secret, options);
            if (jwtDecoded) {
                if (process.env.DEBUG === 'true') {
                    console.log('jwtDecoded: ', jwtDecoded);
                }
                event.token = jwtDecoded;
                callback(null, generatePolicy(jwtDecoded, 'Allow', event.methodArn));
            }
        } catch(error) {
            if (process.env.DEBUG === 'true') {
                // need to define error
                console.log('Invalid JWT error: ' + error);
            }
            const response = {
                statusCode: StatusCodes.FORBIDDEN,
                body: JSON.stringify({error: 'The current user cannot access this resource'})
            };
            callback(new Error('Unauthorized'), response);
        }

    } else {
        if (process.env.DEBUG === 'true') {
            console.log('No JWT present');
        }
        const response = {
            statusCode: StatusCodes.BAD_REQUEST,
            body: JSON.stringify({error: 'Missing JWT'})
        };
        callback(new Error('Unauthorized'), response);
    }
};