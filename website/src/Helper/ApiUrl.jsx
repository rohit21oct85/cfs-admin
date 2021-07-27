let API_URL='';
if(process.env.NODE_ENV === 'development'){
    API_URL = 'https://cfs-admin-panel.herokuapp.com/api/v1/';
}else{
    API_URL = 'http://localhost:8080/api/v1/'
}
export default API_URL;