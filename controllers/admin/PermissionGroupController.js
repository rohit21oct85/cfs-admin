const PermissionGroup = require('../../models/admin/PermissionGroup.js');

const CreatePermissionGroup = async (req, res, next) => {
    try {
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await PermissionGroup.findOneAndUpdate({
            module_name: req.body.module_name,
            module_id: req.body.module_id
        },{ $set: req.body}, options, async (err, result) => {
            if(err) {
                return res.status(409).json({
                    message: "Error occured",
                    error: err.message
                });
            }else{
                const AllPermissionGroups = await PermissionGroup.find({},{__v: 0});
                return res.status(201).json({
                    status: 200,
                    message: "Submitted, Successfully",
                    data: AllPermissionGroups
                });
            }
        });
    }
    catch(error){
        return res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
    
}
const UpdatePermissionGroup = async (req, res, next) =>{
    try {
        await PermissionGroup.findByIdAndUpdate({_id: req.params.id},req.body)
                .then( async response => {
                    const AllPermissionGroups = await PermissionGroup.find({},{__v: 0});
                    return res.status(202).json({
                        message: "permission group, Updated successfully",
                        data: AllPermissionGroups
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
const ViewPermissionGroup = async (req, res, next) => {
    try{
        const PermissionGroupData = await PermissionGroup.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: PermissionGroupData
        });    
    } catch(error){
        return res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllPermissionGroup = async (req, res, next) => {
    try{
        const AllPermissionGroups = await PermissionGroup.find({},{__v: 0});
        return res.status(200).json({ 
            total: AllPermissionGroups.length,
            data: AllPermissionGroups 
        });    
    } catch(error){
        return res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeletePermissionGroup = async (req, res) =>{
    const id = req.params.id;
    try {
        await PermissionGroup.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Permission Group, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};


module.exports = {
    CreatePermissionGroup,
    UpdatePermissionGroup,
    ViewPermissionGroup,
    ViewAllPermissionGroup,
    DeletePermissionGroup
}