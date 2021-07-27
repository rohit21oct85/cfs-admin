const Admin = require('../../models/admin/Admin.js');
const RoleModule = require('../../models/admin/RoleModule.js');
const RolePermission = require('../../models/admin/RolePermission');

const CreateRoleModule = async (req, res) => {
    try {
        
        const methodData = req?.body?.method;
        const moduleData = req?.body?.module;
        
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await methodData.map( data => {
            RolePermission.findOneAndUpdate({
                role_id: data?.role_id,
                module_slug: data?.module_slug,
                method_name: data?.method_name,
                email: data?.email
            },{$set: {
                role_id: data?.role_id,
                role_name: data?.role_name,
                role: data?.role,
                email: data?.email,
                module_id: data?.module_id,
                module_name: data?.module_name,
                module_slug: data?.module_slug,
                module_icon: data?.module_icon,
                method_name: data?.method_name,
            }}, options, async (err, result) => {
                if(err){
                    return res.status(409).json({
                        message: "Error occured",
                        error: err.message
                    }); 
                }
            });
        });

        await moduleData.map( data => {
            RoleModule.findOneAndUpdate({
                role_id: data?.role_id,
                module_slug: data?.module_slug,
                email: data?.email
            },{$set: {
                role_id: data?.role_id,
                role_name: data?.role_name,
                role: data?.role,
                email: data?.email,
                module_id: data?.module_id,
                module_name: data?.module_name,
                module_slug: data?.module_slug,
                module_icon: data?.module_icon,
            }}, options, async (err, result) => {
                if(err){
                    return res.status(409).json({
                        message: "Error occured",
                        error: err.message
                    }); 
                }
            });
        })


        res.status(200).json({ 
            message: "Permission created sucessfully"
        });
    } catch (error) {
        res.status(502).json({
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
const ViewRoleDetails = async (req, res) => {
    try{
        const RoleModuleData = await RoleModule.find({
            role_id: req.params.role_id
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
const ViewRoleModule = async (req, res) => {
    try{
        const RoleModuleData = await RoleModule.find({
            role: req.params.role_id,
            email: req.params.email
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
const ViewRoleUsers = async (req, res) => {
    try{
        const RoleUser = await Admin.find({
            role: req.params.role
        },{__v: 0});
        return res.status(200).json({ 
            data: RoleUser
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewRolePermission = async (req, res) => {
    try{
        const AllRolePermissions = await RolePermission.find({
            module_slug: req.params?.module_slug,
            role: req.params?.role,
            email: req.params?.email
        },{__v: 0});
        return res.status(200).json({ 
            data: AllRolePermissions 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllRolePermission = async (req, res) => {
    try{
        const AllRolePermissions = await RolePermission.find({
            role: req.params?.role,
            email: req.params?.email
        },{__v: 0});
        return res.status(200).json({ 
            data: AllRolePermissions 
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
    const id = req.body.id;
    try {
        await RolePermission.deleteOne({_id: id}).then( response => {
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
        await RoleModule.deleteMany({email: req.body.email, module_slug: req.body.module_slug});
        await RolePermission.deleteMany({email: req.body.email, module_slug: req.body.module_slug});
        res.status(201).json({
            message: "Module Deleted"
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};


module.exports = {
    ViewAllRolePermission,
    ViewRolePermission,
    ViewRoleUsers,
    ViewRoleDetails,
    CreateRoleModule,
    UpdateRoleModule,
    ViewRoleModule,
    ViewAllRoleModule,
    DeleteRoleModule,
    DeleteAllRoleModule
}