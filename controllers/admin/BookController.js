const Book = require('../../models/admin/Book.js');
const csv = require('csv-parser')
const fs = require('fs')

const BooksBySubSubjectId = async(req, res) => {
    try {

        const Books = await Book.find({ sub_subject_id: req.params.sub_subject_id }, { __v: 0 })
                                .sort({created_at: -1}).limit(20);
        return res.status(200).json({
            total: Books.length,
            data: Books
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const createBook = async(req, res) => {
    try {
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };  
        await Book.findOneAndUpdate({
            ISBN13: req.body.ISBN13,
            subject_name: req.body.subject_name,
            subject_id: req.body.subject_id,
            sub_subject_name: req.body.sub_subject_name,
            sub_subject_id: req.body.sub_subject_id,
        },{ $set: req.body},options, async (err, doc) => {
            if(err) {
                return res.status(409).json({
                    message: "Error occured",
                    error: err.message
                });
            }else{
                return res.status(201).json({
                    status: 200,
                    message: "Submitted, Successfully"
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

const uploadBook = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    try {
        let results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(book => {
                    FinalData.push({ 
                        subject_id: data.subject_id, 
                        subject_name: data.subject_name, 
                        sub_subject_name: data.sub_subject_name, 
                        sub_subject_id: data.sub_subject_id,
                        BookName: book.BookName,
                        Edition: book.Edition,
                        ISBN13: book.ISBN13,
                        ISBN10: book.ISBN10,
                        Author1: book.Author1,
                        Author2: book.Author2,
                        Author3: book.Author3,
                        Description: book.description 
                    })
                })
                otherFunction(res, FinalData, function() {
                    fs.unlinkSync(req.file.path)
                })
            });
    } catch (error) {
        return res.status(409).json({
            message: "External Error occured",
            errors: error.message
        });
    }
}
const BulkUploadBook = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    try {
        let results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(book => {
                    FinalData.push({ 
                        subject_id: book.subject_id, 
                        subject_name: book.subject_name, 
                        sub_subject_name: book.sub_subject_name, 
                        sub_subject_id: book.sub_subject_id,
                        BookName: book.BookName,
                        Edition: book.Edition,
                        ISBN13: book.ISBN13,
                        ISBN10: book.ISBN10,
                        Author1: book.Author1,
                        Author2: book.Author2,
                        Author3: book.Author3,
                        Description: book.description 
                    })
                })
                otherFunction(res, FinalData, function() {
                    fs.unlinkSync(req.file.path)
                })
            });
    } catch (error) {
        return res.status(409).json({
            message: "External Error occured",
            errors: error.message
        });
    }
}
const otherFunction = async(res, FinalData, callback) => {
    await Book.insertMany(FinalData).then(() => {
        res.status(200).send('Sub subject Inserted')
        callback()
    }).catch(error => {
        return res.status(409).json({
            message: "Error occured while Inserting Data",
            errors: error.message
        });
    })
}

const updateBook = async(req, res) => {
    try {
        await Book.findByIdAndUpdate({ _id: req.params.book_id }, req.body)
            .then(response => {
                return res.status(201).json({
                    message: "Book, Updated"
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
const updateAllBook = async(req, res) => {
    try {
        await Book.updateMany({ sub_subject_id: req.params.sub_subject_id }, req.body)
            .then(response => {
                return res.status(201).json({
                    message: "Book, Updated"
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


const getAllBook = async(req, res) => {
    try {
        // return res.json(req.params);
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
        if(req.params.sub_subject_id){
            query = {sub_subject_id: req.params.sub_subject_id}    
        }else{
            query = {}    
        }
        await Book.paginate(query, options).then(result => {
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

const deleteBookAll = async(req, res) => {
    const subject_id = req.body.subject_id;
    const sub_subject_id = req.body.sub_subject_id;
    try {
        await Book.deleteMany({ "subject_id": subject_id, "sub_subject_id": sub_subject_id }).then(response => {
            return res.status(201).json({
                message: "subject, deleted successfully"
            })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};
const deleteBook = async(req, res) => {
    const id = req.params.id;
    try {
        await Book.deleteOne({ _id: id }).then(response => {
            return res.status(201).json({
                message: "subject, deleted successfully"
            })
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};


const viewBook = async(req, res) => {
    try {
        const SingleBook = await Book.findOne({ _id: req.params.id }, { __v: 0 });
        return res.status(200).json({
            data: SingleBook
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }

}
const searchBook = async(req, res) => {
    try {
        const isbn = req.params.isbn;
        const books = await Book.aggregate([
            {
                "$search":{
                    "autocomplete": {
                        "path": "ISBN13",
                        "query": `${isbn}`,
                    }
                }
            }
            ,{
                $limit: 5
            }
            
            ,{
                $project: {
                    sub_subject_name: 1,
                    sub_subject_id: 1,
                    subject_name: 1,
                    subject_id: 1,
                    BookName: 1,
                    ISBN13: 1,
                    Edition: 1,
                    Author1: 1,
                    score: { $meta: "searchScore" }
                }
            }
        ]);
        return res.status(200).json({
            data: books
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }

}

const addReview = async (req, res) => {
    try {
        const content = {rating: req.body.rating,review: req.body.review, userName:req.body.userName};
        const filter = {ISBN13: req.body.isbn,_id: req.body.book_id};
        var Content = await Book.findOne(filter);
        Content.reviews.push(content);
        await Content.save();
        return res.status(201).json({
            error: false,
            message: "Review Added"
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}



const allReviews = async (req, res) => {
    try {
        const filter = {_id: req.params.book_id};
        var Content = await Book.findOne(filter);
        var reviewData = Content.reviews.reverse();
        return res.status(201).json({
            error: false,
            data: reviewData
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const UploadReviewCSV = async(req, res) => {
    const data = req.body;
    let FinalData = [];
    try {
        let results = [];
        const filterData = {_id: data.book_id, ISBN13: data.isbn}
        fs.createReadStream(req.file.path,{encoding: 'binary'})
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach( (review, index) => {
                    FinalData.push({ 
                        userName: review.userName, 
                        review: review.review, 
                        rating: review.rating, 
                        
                    })
                })

                UpdateotherFunction(res,filterData, FinalData, function() {
                    fs.unlinkSync(req.file.path)
                })
            });
    } catch (error) {
        return res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}


const UpdateotherFunction = async(res,filterData, FinalData, callback) => {
    try{
        await Book.updateOne(filterData, {$addToSet: { reviews: {$each: FinalData}}});
        return res.status(201).json({
            error: false,
            message: "Review Uploaded successfully"
        })

        callback();

    }catch(err){
        return res.status(409).json({
            error: true,
            message: err.message
        })
    }
}
module.exports = {
    BooksBySubSubjectId,
    getAllBook,
    createBook,
    uploadBook,
    BulkUploadBook,
    updateBook,
    updateAllBook,
    deleteBook,
    deleteBookAll,
    viewBook,
    searchBook,
    addReview,
    allReviews,
    UploadReviewCSV
}