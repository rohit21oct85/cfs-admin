const UserPermission = require('../../models/admin/UserPermission.js');

const CreatePermission = async (req, res) => {
    const body = req.body;
    try {
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await UserPermission.findOneAndUpdate({
            user_name: req.body.user_name,
            user_id: req.body.user_id
        },{ $set: req.body}, options, async (err, result) => {
            if(err) {
                return res.status(409).json({
                    message: "Error occured",
                    error: err.message
                });
            }else{
                const AllPermissions = await UserPermission.find({},{__v: 0});
                return res.status(201).json({
                    status: 200,
                    message: "Submitted, Successfully",
                    data: AllPermissions
                });
            }
        });
    } catch (error) {
        return res.status(502).json({
            message: "Error occured",
            errors: error.message
        })
    }
}
const UpdatePermission = async (req, res) =>{
    try {
        await UserPermission.findByIdAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "permission, Updated successfully"
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
const ViewPermission = async (req, res) => {
    try{
        const PermissionData = await UserPermission.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: PermissionData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllPermission = async (req, res) => {
    try{
        const AllPermissions = await UserPermission.find({},{__v: 0});
        return res.status(200).json({ 
            total: AllPermissions.length,
            data: AllPermissions 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeletePermission = async (req, res) =>{
    const id = req.params.id;
    try {
        await UserPermission.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Permission, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};
const DeleteAllPermission = async (req, res) =>{
    const ids = req.params.id;
    try {
        await UserPermission.deleteMany({_id: { $in: [ids]}}).then( response => {
            return res.status(201).json({
                message: "Selected Permissions, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};


module.exports = {
    CreatePermission,
    UpdatePermission,
    ViewPermission,
    ViewAllPermission,
    DeletePermission,
    DeleteAllPermission
}