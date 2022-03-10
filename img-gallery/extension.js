module.exports = {
    "name": "img-gallery",
    "publisher": "Sample",
    "cards": [{
        "type": "GalleryCard",
        "source": "./src/cards/GalleryCard",
        "title": "Meme Gallery Card",
        "displayCardType": "Gallery Card",
        "description": "A Gallery of win",
        "pageRoute": {
            "route": "/",
            "excludeClickSelectors": ['a', 'img', 'button']
        }
    }],
    "page": {
        "source": "./src/page/router.jsx"
    }
}