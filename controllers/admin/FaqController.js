const Faq = require('../../models/admin/Faq.js');

const getAllFaqs = async (req, res) => {
    try {
        let pageno = parseInt(req.params.pageno);
        let limit = parseInt(req.params.limit);
        const myCustomLabels = {
            totalDocs: 'itemCount',
            docs: 'itemsList',
            limit: 'perPage',
            page: 'currentPage',
            nextPage: 'next',
            prevPage: 'prev',
            totalPages: 'pageCount',
            pagingCounter: 'slNo',
            meta: 'paginator',
            };
        const options = {
            page: pageno,
            limit: limit,
            customLabels: myCustomLabels,
            collation: {
                locale: 'en',
            },
        };
    
        await Faq.paginate({},options).then(result => {
            return res.status(200).json({
                data: result.itemsList,
                itemCount: result.paginator.itemCount,
                perPage: result.paginator.perPage,
                currentPage: result.paginator.currentPage,
                pageCount: result.paginator.pageCount,
                next: result.paginator.next,
                prev: result.paginator.prev,
                slNo: result.paginator.slNo,
                hasNextPage: result.paginator.hasNextPage,
                hasPrevPage: result.paginator.hasPrevPage
            });
        });
    
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const AddCategory = async (req, res) => {
    try {
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await Faq.findOneAndUpdate({
            faq_category: req.body.faq_category,
        },{ $set: {
            faq_category: req.body.faq_category,
            faq_image: req.body.faq_image
        }},options, async (err, doc) => {
            if(err) {
                return res.status(409).json({
                    message: "Error occured",
                    error: err.message
                });
            }else{
                return res.status(201).json({
                    status: 200,
                    message: "Created, Successfully"
                });
            }
        });

    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const AddFaqQuestion = async (req, res) => {
    try {
        const content = {question: req.body.question,answer: req.body.answer};
        const filter = {_id: req.params.faq_id};
        var Content = await Faq.findOne(filter);
        Content.faq_content.push(content);
        await Content.save();

        return res.status(201).json({
            error: false,
            message: "Created Question"
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const getSingleFaqs = async (req, res) => {
    try {
        
        const filter = {_id: req.params.faq_id};
        const project = {faq_content: 1,_id: 0}
        const result = await Faq.findOne(filter,project);
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
module.exports = {
    getAllFaqs,
    AddCategory,
    AddFaqQuestion,
    getSingleFaqs
}