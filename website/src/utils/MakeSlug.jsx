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
    if(str){
        return str.replaceAll('-', ' ');   
    }else{
        return '';
    }
}

const getAllValue = (str) => {
    const data = str.split('-')
    return {
        id: data[0],
        value: MakeSlug(data[1]),
        value2: MakeSlug(data[2])
    }
}

export {
    MakeSlug,
    SameSlug,
    GetString,
    GetName,
    getAllValue
}
