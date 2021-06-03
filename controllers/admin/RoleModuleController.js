const RoleModule = require('../../models/admin/RoleModule.js');

const CreateRoleModule = async (req, res) => {
    try {
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await RoleModule.findOneAndUpdate({
            role_name: req.body.role_name,
            role_id: req.body.role_id
        },{ $set: req.body}, options, async (err, result) => {
            if(err) {
                return res.status(409).json({
                    message: "Error occured",
                    error: err.message
                });
            }else{
                const AllRoleModules = await RoleModule.find({},{__v: 0});
                return res.status(201).json({
                    status: 200,
                    message: "Submitted, Successfully",
                    data: AllRoleModules
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
const UpdateRoleModule = async (req, res) =>{
    try {
        await RoleModule.findByIdAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "RoleModule, Updated successfully"
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
const ViewRoleModule = async (req, res) => {
    try{
        const RoleModuleData = await RoleModule.findOne({
            role_id: req.params.role_id,
            role_name: req.params.role_name,
        },{__v: 0});
        return res.status(200).json({ 
            data: RoleModuleData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllRoleModule = async (req, res) => {
    try{
        const AllRoleModules = await RoleModule.find({},{__v: 0});
        return res.status(200).json({ 
            total: AllRoleModules.length,
            data: AllRoleModules 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteRoleModule = async (req, res) =>{
    const id = req.params.id;
    try {
        await RoleModule.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "RoleModule, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};
const DeleteAllRoleModule = async (req, res) =>{
    const ids = req.params.id;
    try {
        await RoleModule.deleteMany({_id: { $in: [ids]}}).then( response => {
            return res.status(201).json({
                message: "Selected RoleModules, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};


module.exports = {
    CreateRoleModule,
    UpdateRoleModule,
    ViewRoleModule,
    ViewAllRoleModule,
    DeleteRoleModule,
    DeleteAllRoleModule
}