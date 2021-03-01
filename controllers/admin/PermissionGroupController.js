const PermissionGroup = require('../../models/admin/PermissionGroup.js');

const CreatePermissionGroup = async (req, res) => {
    const data = req.body;
    try {
        const newPermissionGroup = new PermissionGroup(data);
        await newPermissionGroup.save();
        const AllPermissionGroups =  await ViewPermissionGroup();
        return res.status(200).json({
            message: "Submitted, Successfully",
            data: AllPermissionGroups
        });
    }
    catch(error){
        return res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
    
}
const UpdatePermissionGroup = async (req, res) =>{
    try {
        await PermissionGroup.findByIdAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "permission group, Updated successfully"
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
const ViewPermissionGroup = async (req, res) => {
    try{
        const PermissionGroupData = await PermissionGroup.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: PermissionGroupData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllPermissionGroup = async (req, res) => {
    try{
        const AllPermissionGroups = await PermissionGroup.find({},{__v: 0});
        return res.status(200).json({ 
            total: AllPermissionGroups.length,
            data: AllPermissionGroups 
        });    
    } catch(error){
        res.status(409).json({
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