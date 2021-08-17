let API_URL='';
if(process.env.NODE_ENV === 'production'){
    API_URL = 'https://admin.crazyforstudy.com/api/v1/';
}else{
    API_URL = 'http://localhost:3000/api/v1/'
}
export default API_URL;
