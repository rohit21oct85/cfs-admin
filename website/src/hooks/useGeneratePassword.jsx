import {useEffect, useState} from 'react'

export default function useGeneratePassword() {
    const [randomPassword, setRandomPassword] = useState(null);
    const generateRandomPassword = async () => {
        var pass = '';
        var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +  
                'abcdefghijklmnopqrstuvwxyz0123456789'+
                '@#$&*'; 
        for (let i = 1; i <= 12; i++) { 
            var char = Math.floor(Math.random() 
                        * str.length + 1); 
                
            pass += str.charAt(char) 
        } 
        setRandomPassword(pass);
    }
    useEffect( () => {
        return generateRandomPassword();
    },[]);

    return {randomPassword,generateRandomPassword};
}
