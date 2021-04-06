const RemoveData = require('../../models/admin/RemoveData.js');
const bcrypt = require('bcryptjs');

const createRemoveData = async (req, res) => {
    const body = req.body;
    try {
        
        await RemoveData.findOneAndUpdate({
                module_name: req.body.module_name,
                module_method: req.body.module_method
            },
                req.body)
            .then( async (response) => {
                if(response){
                    const AllRemoveData = await RemoveData.find({module_name: req.body.module_name},{__v: 0});
                    return res.status(200).json({ 
                        message: "Delete Resource created sucessfully",
                        data: AllRemoveData
                    });
                }else{
                    const newRemoveData = new RemoveData(body);
                    await newRemoveData.save();
                    const AllRemoveData = await RemoveData.find({module_name: req.body.module_name},{__v: 0});
                    return res.status(200).json({ 
                        message: "Delete Resource created sucessfully",
                        data: AllRemoveData
                    });
                }
                
            })
            .catch(error => {
                return res.status(500).json({
                    message: "Error Found",
                    errors: error.message
                })
            });


        
    
        
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const updateRemoveData = async (req, res) =>{
    try {
        await RemoveData.findOneAndUpdate({_id: req.params.id},req.body)
            .then(response => {
                return res.status(202).json({
                    message: "Delete Resource, Updated successfully"
                })
            })
            .catch(error => {
                return res.status(500).json({
                    message: "Error Found",
                    errors: error.message
                })
            });

    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}
const getAllRemoveData = async (req, res) => {
    try{
        const AllRemoveData = await RemoveData.find({},{__v: 0});
        return res.status(200).json({ 
            total: AllRemoveData.length,
            data: AllRemoveData 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const removeRemoveData = async (req, res) => {
    const id = req.params.id;
    try {
        await RemoveData.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Delete Resource, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}
const getDataView = async (req, res) => {
    const module_name = req.params.module;
    try{
        const AllRemoveData = await RemoveData.find({module_name: module_name},{__v: 0});
        return res.status(200).json({ 
            total: AllRemoveData.length,
            data: AllRemoveData 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const checkPassword = async (req, res) => {
    try {
        await RemoveData.findOne({
            module_name: req.body.module,
            module_method: req.body.method,
            module_plain_password: req.body.password
        },{__v: 0}).then( response => {
            if(response){
                return res.status(200).json({ 
                    status: true,
                    data: response._id
                }); 
            }else{
                return res.status(200).json({ 
                    status: false,
                    message: "Module password not valid"
                }); 
            }
        });
        
    } catch (error) {
        return res.status(402).json({
            message: error.message
        });  
    }
}


module.exports = {
    createRemoveData,
    updateRemoveData,
    getAllRemoveData,
    removeRemoveData,
    getDataView,
    checkPassword
}