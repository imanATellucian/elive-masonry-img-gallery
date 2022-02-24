module.exports = {
    "name": "img-gallery",
    "publisher": "Sample",
    "cards": [{
        "type": "GalleryCard",
        "source": "./src/cards/GalleryCard",
        "title": "Meme Gallery Card",
        "displayCardType": "Gallery Card",
        "description": "This is an introductory card to the Ellucian Experience SDK",
        "pageRoute": {
            "route": "/",
            "excludeClickSelectors": ['a', 'img', 'button']
        }
    }],
    "page": {
        "source": "./src/page/router.jsx"
    }
}