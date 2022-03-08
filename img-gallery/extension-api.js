module.exports = {
    "name": "img-gallery-api",
    "publisher": "Sample",
    "configuration": {
        "client": [{
            "key": "api-base-url",
            "label": "api base url",
            "type": "url"
            // "required": true
            // I had to make required false because config type url requires https
            // and we'll be testing with http on localhost
        }],
        "server": [{
            "key": "extension-server-text",
            "label": "extension server text",
            "type": "text"
        }, {
            "key": "extension-server-password",
            "label": "extension server password",
            "type": "password"
        }]
    },
    "cards": [{
        "type": "GalleryCard",
        "source": "./src/cards/GalleryCardWithAPI",
        "title": "Meme Gallery Card API",
        "displayCardType": "Gallery Card",
        "description": "A Gallery of win",
        "pageRoute": {
            "route": "/",
            "excludeClickSelectors": ['a', 'img', 'button']
        }
    },{
        "type": "AdministerGalleryCard",
        "source": "./src/cards/AdministerGalleryCard",
        "title": "Administer Meme Gallery Card",
        "displayCardType": "Admin Gallery Card",
        "description": "Add more winning"
    }],
    "page": {
        "source": "./src/page/routerWithAPI.jsx"
    }
}