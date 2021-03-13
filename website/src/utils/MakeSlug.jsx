const MakeSlug = (str) => {
    return str.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');   
}
const GetString = (str, length) => {
    return str.substr(0,length);
}
const GetName = (str) => {
    return str.replaceAll('-', ' ');   
}

export {
    MakeSlug,
    GetString,
    GetName
}
