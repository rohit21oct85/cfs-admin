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
            const modules = value.split('_');
            for (let i = 0; i < modules.length; i++) {
                if(i==0){
                    moduleArr.push({ [e.target.name+'_name'] : modules[i]});
                }else if(i == 1){
                    moduleArr.push({ [e.target.name+'_id']: modules[i]});
                }
            }
            value = moduleArr;
            for (let i = 0; i < modules.length; i++) {
                setFormData({...formData, [e.target.name+'_name']:  value[0].module_name, [e.target.name+'_id']:  value[1].module_id});
            }
        } 
        else if(e.target.type == 'checkbox') {
            const checkeds = document.getElementsByTagName('input');
            for (let i = 0; i < checkeds.length; i++) {
                if (checkeds[i].checked) {
                checkedArr.push({name: checkeds[i].value});
                }
            }
            value = checkedArr;
            setFormData({...formData, [e.target.name]:  value});
        }
        return formData;
       }   
    }
    useEffect( () => {
        handleChange();
    },[formData])

    return {formData, handleChange, setFormData};
}