let API_URL='';
if(process.env.NODE_ENV === 'production'){
    API_URL = 'http://65.0.252.57/api/';
}else{
    API_URL = 'http://localhost:3000/api/v1/'
}
export default API_URL;