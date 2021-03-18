const MakeSlug = (str) => {
    return str.trim().toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');   
}
const SameSlug = (str) => {
    return str.trim().replace(/[^\w ]+/g,'').replace(/ +/g,'-');   
}

const GetString = (str, length) => {
    return str.substr(0,length);
}
const GetName = (str) => {
    return str.replaceAll('-', ' ');   
}

export {
    MakeSlug,
    SameSlug,
    GetString,
    GetName
}
