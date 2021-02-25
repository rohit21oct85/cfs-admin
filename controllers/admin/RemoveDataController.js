const RemoveData = require('../../models/admin/RemoveData.js');
const bcrypt = require('bcrypt');

const createRemoveData = async (req, res) => {
    const body = req.body;
    try {
        const newRemoveData = new RemoveData(body);
        await newRemoveData.save();
        return res.status(200).json({ 
            message: "Delete Resource created sucessfully"
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
    const module = req.params.module;
    try{
        const AllRemoveData = await RemoveData.find({module: module},{__v: 0});
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
        await RemoveData.findOne({module: req.body.module},{__v: 0}).then( resource => {
            if(resource){
                bcrypt.compare(req.body.password, resource.password, function(err,response){
                    if(err){
                        return res.status(409).json({ 
                            message: "Password does not match"
                        });
                    }
                    else{
                        if(response){
                           return res.status(200).json({ 
                                status: true
                            });
                        } else {
                            return res.status(401).json({ 
                                message: "Password does not match"
                            });
                        }                      
                    }
                });
            }else{
                res.status(409).json({ 
                    message: "Resource or Password doesnot matched"
                })
            }
        }).catch(error => {
            res.status(500).json({
                message: "Resource Does not exists in our database",
                errors: error.message
            });     
        })
        
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