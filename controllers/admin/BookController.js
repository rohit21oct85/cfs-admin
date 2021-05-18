const Book = require('../../models/admin/Book.js');
const Chapter = require('../../models/admin/Chapter.js');
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
                    published: 1,
                    bartlyby_imported: 1
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
        const content = {rating: req.body.rating,review: req.body.review, userName:req.body.userName, status: true};
        const filter = {ISBN13: req.body.isbn,_id: req.body.book_id};
        if(req.body.review_id){
            let Review = await Book.findOne(filter);
            let singleReview = await Review.reviews.id(req.body.review_id);
            singleReview.set(content);
            await Review.save();
            return res.status(201).json({
                error: false,
                message: "Review updated"
            });
            
        }else{
            var Content = await Book.findOne(filter);
            Content.reviews.push(content);
            await Content.save();
            return res.status(201).json({
                error: false,
                message: "Review Added"
            });
        }
        
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const addFaq = async (req, res) => {
    try {
        const content = {question:req.body.question,answer: req.body.answer, status: true};
        const filter = {ISBN13: req.body.isbn,_id: req.body.book_id};
        if(req.body.faq_id){
            let FAQ = await Book.findOne(filter);
            let singleFaq = await FAQ.faqs.id(req.body.faq_id);
            singleFaq.set(content);
            await FAQ.save();
            return res.status(201).json({
                error: false,
                message: "FAQ updated"
            });
            
        }else{
            var Content = await Book.findOne(filter);
            Content.faqs.push(content);
            await Content.save();
            return res.status(201).json({
                error: false,
                message: "Faq Added"
            });
        }
        
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
const allFaqs = async (req, res) => {
    try {
        const filter = {_id: req.params.book_id};
        var Content = await Book.findOne(filter);
        var reviewData = Content.faqs.reverse();
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
                        status: true, 
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

const updateReviewStatus = async (req, res) => {
    try {
        const filter = {_id: req.body.book_id};
        const content = {status: req.body.status};
        
        let Review = await Book.findOne(filter);
        let singleReview = await Review.reviews.id(req.body.review_id);
        singleReview.set(content);
        await Review.save();
        return res.status(201).json({
            error: false,
            message: "Review status updated"
        });
        
       
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const updateFaqStatus = async (req, res) => {
    try {
        const filter = {_id: req.body.book_id};
        const content = {status: req.body.status};
        
        let Faq = await Book.findOne(filter);
        let singleFaq = await Faq.faqs.id(req.body.faq_id);
        singleFaq.set(content);
        await Faq.save();
        return res.status(201).json({
            error: false,
            message: "Faq status updated"
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const updatePublishedStatus = async (req, res) => {
    try {
        const filter = {_id: req.body.book_id};
        const content = {published: req.body.published};
        await Book.findByIdAndUpdate(filter, content);
        return res.status(201).json({
            error: false,
            message: "Freelancer Published status updated"
        });
        
       
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}


const deleteReview = async(req, res) => {
    try {
        
        let Review = await Book.findOne({_id: req.params.book_id});
        await Review.reviews.id(req.params.review_id).remove();
        await Review.save();
        return res.status(201).json({
            error: false,
            message: "Review Deleted",
        });
       
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const deleteFaq = async(req, res) => {
    try {
        
        let Faq = await Book.findOne({_id: req.params.book_id});
        await Faq.faqs.id(req.params.faq_id).remove();
        await Faq.save();
        return res.status(201).json({
            error: false,
            message: "Faq Deleted",
        });
       
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const totalQuestions = async(req, res) => {
    try {
        let BookCount = await Chapter.count({book_isbn: req.params.book_isbn});
        res.status(201).json({
            error: false,
            count: BookCount
        });
       
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const BookSeo = async(req, res) => {
    try {
        let projection = {
            MetaTitle: 1,
            MetaKeywords: 1,
            MetaDescription: 1,
            NoIndex: 1,
            DisplayTitle: 1,
            similarHeading: 1,
            faqHeading: 1,
            Description: 1,
            Author2: 1,
            AltImage: 1,
            urls: 1,
            seo: 1,
        }
        let BookDetails = await Book.findOne({_id: req.params.book_id},projection);
        res.status(201).json({
            error: false,
            details: BookDetails
        });
       
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const SaveBookSeo = async(req, res) => {
    try {
        let filter = {_id: req.body.book_id, ISBN13: req.body.isbn}
        let updateData = {
            MetaTitle: req.body.MetaTitle,
            MetaKeywords: req.body.MetaKeywords,
            MetaDescription: req.body.MetaDescription,
            NoIndex: req.body.NoIndex,
            DisplayTitle: req.body.DisplayTitle,
            similarHeading: req.body.similarHeading,
            Description: req.body.Description,
            Author2: req.body.Author2,
            AltImage: req.body.AltImage,
            urls: req.body.urls,
            seo: true,
        }
        await Book.findOneAndUpdate(filter,updateData);
        return res.status(201).json({
            error: false,
            message: "Book SEO Updated successfully"
        });
       
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}

const addFields = async (req, res) => {
    await Book.updateMany({},
    {
        "bartlyby_imported": 0
    });
    res.status(201).json({
        error: false,
        message: "field cleared"
    });
}


const relatedBooks = async(req, res) => {
    try {
        const Books = await Book.aggregate([
            {$match: {sub_subject_name: `${req.params.sub_subject}`}},
            { $sample: { size: 20 } }
        ])
        return res.status(200).json({
            data: Books
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}
const smimilarBooks = async(req, res) => {
    try {
        const SimilarBooks = await Book.findOne({_id: `${req.params.book_id}`},{similarBooks: 1,_id: 0})
        return res.status(200).json({
            data: SimilarBooks
        });
    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}


const addSimilarBooks = async(req, res) => {
    try {
        
        const filter = {_id: req.body.book_id, ISBN13: req.body.book_isbn};
        const sb = req.body.similarBooks;
        const sbook_id = req.body.id;
        if(req.body.id){
            const updateData = {DisplayTitle: req.body.similarBooks.DisplayTitle, AltImage: req.body.similarBooks.AltImage}
            // return res.send(updateData);
            let SBook = await Book.findOne(filter);
            let singleSBook = await SBook.similarBooks.id(sbook_id);
            singleSBook.set(updateData);
            await SBook.save();
            return res.status(201).json({
                error: false,
                message: "Similar Books Updated successfully"
            })
        }else{
            await Book.updateOne(filter, {$addToSet: { similarBooks: {$each: sb}}});
            return res.status(201).json({
                error: false,
                message: "Similar Books Added successfully"
            })
        }

        

    } catch (error) {
        res.status(409).json({
            message: "Error occured",
            errors: error.message
        });
    }
}


module.exports = {
    smimilarBooks,
    addSimilarBooks,
    relatedBooks,
    addFields,
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
    addFaq,
    allReviews,
    allFaqs,
    UploadReviewCSV,
    updateReviewStatus,
    deleteReview,
    deleteFaq,
    updatePublishedStatus,
    updateFaqStatus,
    totalQuestions,
    BookSeo,
    SaveBookSeo
}