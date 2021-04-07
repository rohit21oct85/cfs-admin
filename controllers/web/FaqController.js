const Faq = require('../../models/admin/Faq.js');

const getFaqCategory = async (req, res) => {
    try {
        const result = await Faq.find({});
        res.status(201).json({
            error: false,
            data: result
        });
    } catch (error) {
        res.status(409).json({
            error: true,
            message: "Error occured",
            errors: error.message
        });
    }
}

const getCategoryContent = async (req, res) => {
    // return res.send(req.params.cat)
    try {
        // const cat = String(req.params.cat)
        const filter = {faq_category: req.params.cat};
        const result = await Faq.findOne(filter);
        res.status(201).json({
            error: false,
            data: result.faq_content
        });
    } catch (error) {
        res.status(409).json({
            error: true,
            message: "Error occured",
            errors: error.message
        });
    }
}

module.exports = {
    getFaqCategory,
    getCategoryContent,
}