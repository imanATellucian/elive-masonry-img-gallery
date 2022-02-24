// import only what you need from lodash
import sampleSize from "lodash/sampleSize";
import sample from "lodash/sample";

export const memes = {
    cats: [
        'https://i.imgur.com/S07cJho.jpeg',
        'https://i.imgur.com/JHx31Yx.jpeg',
        'https://i.imgur.com/w1baEL7.jpeg',
        'https://i.imgur.com/UxJtdYD.jpeg',
        'https://i.imgur.com/Imd6sMe.jpeg',
        'https://i.imgur.com/AFL95Gw.jpeg',
        'https://i.imgur.com/xRRHc26.jpeg',
        'https://i.imgur.com/Gr9N84T.png',
        'https://i.imgur.com/CzcVhEB.jpg',
        'https://i.imgur.com/32dEntW.jpg',
        'https://i.imgur.com/Se3ezH9.jpg',
        'https://i.imgur.com/u6EkaKt.jpeg',
        'https://i.imgur.com/7OLtYSX.jpg',
        'https://i.imgur.com/HMkFuSZ.jpg',
        'https://i.redd.it/3kalp3gvqlc01.jpg',
        'https://i.imgur.com/8l9yvRJ.jpeg',
        'https://i.imgur.com/LSTzQAj.jpg',
        'https://i.imgur.com/A7rq2dv.jpeg',
        'https://i.imgur.com/0nxb5eV.jpeg',
        'https://i.imgur.com/yH992cN.jpg',
        'https://i.imgur.com/CEBhb9P.jpeg'
    ],
    possums: [
        'https://i.imgur.com/l8SM70N.png',
        'https://i.imgur.com/1Ygigi2.jpeg',
        'https://i.imgur.com/ylTuaiP.jpeg'
    ],
    racoons: [
        'https://pbs.twimg.com/media/E1muveLVkAE3xO3?format=jpg&name=medium',
        'https://i.imgur.com/WTddXsh.png',
        'https://i.imgur.com/NdZrxqJ.jpeg',
        'https://i.imgur.com/UlsNrF3.jpeg'
    ],
    birds: [
        'https://i.imgur.com/GUCXHgE.jpg'
    ],
    skeletons: [
        'https://i.imgur.com/Hxsajun.jpg',
        'https://i.imgur.com/sWrONyi.jpeg',
        'https://i.imgur.com/AC8L9EP.jpeg'
    ],
    programming: [
        'https://i.imgur.com/80sKbnk.jpeg',
        'https://i.imgur.com/v8p7nbD.jpeg',
        'https://i.imgur.com/R8QPIVc.jpeg',
        'https://i.imgur.com/fcsCgyf.png',
        'https://i.imgur.com/6Zpzocf.jpg',
        'https://i.imgur.com/Rib7Ke5.jpeg',
        'https://i.imgur.com/oQBRlvj.jpeg'
    ],
    science: [
        'https://i.imgur.com/dVKVSxZ.jpeg',
        'https://i.imgur.com/QNHowTc.jpeg',
        'https://i.imgur.com/vIEUqjI.jpeg',
        'https://i.imgur.com/mbsHGxD.jpeg',
        'https://i.imgur.com/psIAfQn.jpeg',
        'https://i.imgur.com/PbO8Vk3.jpeg',
        'https://i.imgur.com/eZIygMS.jpeg',
        'https://i.imgur.com/7QUKDdj.jpeg'
    ],
    general: [
        'https://i.imgur.com/v18Eycc.jpeg',
        'https://i.imgur.com/UhC4VGd.jpeg',
        'https://i.imgur.com/GMy0BJX.jpg',
        'https://i.imgur.com/SKnuq2A.jpg',
        'https://pbs.twimg.com/media/E0zfhiHXEAAYdJu.jpg',
        'https://pbs.twimg.com/media/E0tKuKeXMAIO4NC.jpg',
        'https://i.imgur.com/MoLjut1.jpeg',
        'https://i.imgur.com/MYGnmhk.jpeg',
        'https://i.imgur.com/I6hCdD1.jpeg',
        'https://i.imgur.com/acc4TiZ.jpg',
        'https://i.imgur.com/qw5G6sB.jpeg',
        'https://i.imgur.com/lp4fIbZ.jpeg',
        'https://i.imgur.com/8qt4a2W.jpeg',
        'https://i.imgur.com/0N8rWTc.png',
        'https://i.imgur.com/QV6v2bu.jpeg'
    ]
};

export const allImgs = () => {
    const all = [];
    // eslint-disable-next-line no-unused-vars
    for (const [Category, images] of Object.entries(memes)) {
        all.push(...images);
    }
    return all;
}

export const imgsByCategory = (category) => {
    return memes[category];
}

export const allCategories = () => {
    return Object.keys(memes);
}

export const randomImgs = (howMany = 12) => {
    return sampleSize(allImgs(), howMany);
}

export const getRandomImg = (category="any") => {
    const categories = Object.keys(memes);
    if (categories.indexOf(category) != -1 ) {
        return { category, meme: sample(memes[category]) };
    }
    const randomCategory= sample(categories);
    return { category: randomCategory, meme: sample(memes[randomCategory])};
}