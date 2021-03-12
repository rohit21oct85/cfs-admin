const MakeSlug = (str) => {
    return str.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');   
}
const GetString = (str, length) => {
    return str.substr(0,length);
}

const GenerateImage = () => {
    return '';
}

export {
    MakeSlug,
    GetString,
    GenerateImage
}
