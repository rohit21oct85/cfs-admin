const Tutor = require('../../models/tutor/Tutor.js');

const getAllTutor = async (req, res) => {
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
        let query;
        if(req.params.status === 'all' && req.params.master_subject === 'all'){
            query = {} 
        }else if(req.params.master_subject === 'all' && req.params.status !== 'all'){
            query = {status: `${req.params.status}`} 
        }else if(req.params.status === 'all' && req.params.master_subject !== 'all'){
            query = {master_subject: req.params.master_subject} 
        }
        else if(req.params.status !== 'all' || req.params.master_subject !== 'all'){
            query = {status: `${req.params.status}`, master_subject: req.params.master_subject} 
        }else{
            query = {}    
        }
        
        // return res.send(query);
        await Tutor.paginate(query,options).then(result => {
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
const updateStatus = async (req, res) => {
    try {
        
        const filter = {_id: req.body.tutor_id};
        let status = '0';
        if(req.body.status === true){
            status = 1;
        }
        await Tutor.findOneAndUpdate(filter,{status: status});
        res.status(201).json({
            error: false,
            message: "Tutor Activated successfully"
        })
        

    } catch (error) {
        res.status(501).json({
            error: true,
            message: error.message
        })
    }
}
module.exports = {
    getAllTutor,
    updateStatus
}