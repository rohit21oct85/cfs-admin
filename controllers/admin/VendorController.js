const Vendor = require('../../models/admin/Vendor.js');

const CreateVendor = async (req, res) => {
    const body = req.body;
    try {
        const newVendor = new Vendor(body);
        await newVendor.save();
        return res.status(200).json({ 
            message: "Vendor created sucessfully"
        });
    
        
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}
const UpdateVendor = async (req, res) =>{
    try {
        await Vendor.findOneAndUpdate({_id: req.params.id},req.body)
                .then(response => {
                    return res.status(202).json({
                        message: "Vendor, Updated successfully"
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
const ViewVendor = async (req, res) => {
    try{
        const VendorData = await Vendor.findOne({_id: req.params.id},{__v: 0});
        return res.status(200).json({ 
            data: VendorData
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const ViewAllVendor = async (req, res) => {
    try{
        const AllVendors = await Vendor.find({},{__v: 0});
        return res.status(200).json({ 
            data: AllVendors 
        });    
    } catch(error){
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const DeleteVendor = async (req, res) =>{
    const id = req.params.id;
    try {
        await Vendor.deleteOne({_id: id}).then( response => {
            return res.status(201).json({
                message: "Vendor, deleted successfully"
              })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

module.exports = {
    CreateVendor,
    UpdateVendor,
    ViewVendor,
    ViewAllVendor,
    DeleteVendor,
}