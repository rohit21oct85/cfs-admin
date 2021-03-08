import {useState, useEffect} from 'react'

export const useFormData = () => {

    const [formData, setFormData] = useState({});
    
    const handleChange = async (e) => {
        
       if(e){
        const data = e.target.value;
        const checkedArr = [];
        const moduleArr = [];
        let value;
        value = data.replace(/[^a-zA-Z0-9-_, ]/g, "");
        if(e.target.type == 'text'){
            setFormData({...formData, [e.target.name]:  value});
        }
        else if(e.target.type == 'select-one') {
            if(value){
                const modules = value.split('_');
                for(let i = 0; i < modules.length; i++) {
                    if(i==0){
                        moduleArr.push({ [e.target.name+'_name'] : modules[i]});
                    }else if(i == 1){
                        moduleArr.push({ [e.target.name+'_id']: modules[i]});
                    }
                }
                value = moduleArr;
                for (let i = 0; i < modules.length; i++) {
                    setFormData({...formData, [e.target.name+'_name']:  value[0][e.target.name+'_name'], [e.target.name+'_id']:  value[1][e.target.name+'_id']});
                }
            }
            
        } 
        else if(e.target.type == 'checkbox'){
            
                const checkeds = document.getElementsByTagName('input');
                for (let i = 0; i < checkeds.length; i++) {
                    if (checkeds[i].checked) {
                        let valueContains =  checkeds[i].value
                        if(valueContains.includes('_')){
                            const Values = valueContains.split('_');
                            for(let i = 0; i < Values.length; i++) {
                                if(i==0){
                                    moduleArr.push({ ['method_name'] : Values[i]});
                                }else if(i == 1){
                                    moduleArr.push({ ['module_name']: Values[i]});
                                }
                            }
                            checkedArr.push({method_name: Values[0], module_name: Values[1]});
                            value = checkedArr;
                            setFormData({...formData, [e.target.name]:  value});
                        }else{
                            if(checkeds[i].value != 'on'){
                                checkedArr.push({name: checkeds[i].value});
                                value = checkedArr;
                                setFormData({...formData, [e.target.name]:  value});
                            }
                            
                        }
                    }
                }
                
            
            
        }
        return formData;
       }   
    }
    useEffect( () => {
        handleChange();
    },[formData])

    return {formData, handleChange, setFormData};
}