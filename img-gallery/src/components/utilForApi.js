// import only what you need from lodash
import sampleSize from "lodash/sampleSize";
import sample from "lodash/sample";

const defaultBaseUrl = "http://localhost:3000/dev/api/gallery-dynamo/";

function composeUrl({ baseUrl, param='' }) {
    const url = baseUrl ? baseUrl : defaultBaseUrl;
    const withSlash = url.substr(-1) === '/' ? url : `${url}/`;
    let composedUrl = withSlash;
    if (param.length) {
        composedUrl = `${withSlash}${param}/`;
    }
    return composedUrl;
}
// Docs:  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
export const newImg = async ({ jwt, baseUrl, album = "memes", imageUrl = "", tags = [] }) => {
    const url = composeUrl({baseUrl});
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        },
        // body data type must match "Content-Type" header
        body: JSON.stringify({ album, imageUrl, tags })
    });
    // parses JSON response into native JavaScript objects
    return response.json();
}

export const allImgs = async ({baseUrl}) => {
    const url = composeUrl({baseUrl, param: "all"});
    const all = await fetch(url);
    return all.json();
}

export const imgsByCategory = async ({baseUrl, category}) => {
    const memes = await allImgs({baseUrl});
    return memes[category];
}

export const allCategories = async ({baseUrl}) => {
    const url = composeUrl({baseUrl, param: "categories"});
    const all = await fetch(url);
    return all.json();
}


export const getRandomImg = async ({baseUrl, category = "any"}) => {
    const memes = await allImgs({baseUrl});
    const categories = Object.keys(memes);
    if (categories.indexOf(category) != -1) {
        return { category, meme: sample(memes[category]) };
    }
    const randomCategory = sample(categories);
    return { category: randomCategory, meme: sample(memes[randomCategory]) };
}