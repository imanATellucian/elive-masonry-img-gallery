const AWS = require('aws-sdk');
const { memes } = require('./memes');
require('dotenv').config();
AWS.config.update({region:'us-east-1'});
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: process.env.TABLE_NAME
}

async function createItem(item) {
    try {
        await docClient.put(item).promise();
    } catch (err) {
        return err;
    }
}

async function main() {
    try {
        let newItems = [];
        const categories = Object.keys(memes);
        categories.forEach(category => {
            const imgsForCategory = memes[category];
            // console.log("imgsForCategory", imgsForCategory);
            imgsForCategory.forEach(item => {
                const newItem = Object.assign(params, {
                    Item: {
                        album: "memes",
                        imageUrl: item,
                        tags: [category]
                    }
                });
                console.log("newItem", newItem.Item.tags[0], newItem.Item.imageUrl);
                newItems.push(createItem(newItem));
            });
        });
        const success = await Promise.all(newItems);
        console.log("success: ", success);

    } catch (err) {
        console.error(err);
    }
};

main();