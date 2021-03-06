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
    const data = req.body;
    return res.send(data);
    const sub_subject = data.sub_subject;
    const BookData = sub_subject.split(",");
    let FinalData = [];

    try {
        await BookData.forEach(sub => {
            FinalData.push({ status: 1, 'subject_id': data.subject_id, subject: data.subject, sub_subject: sub })
        })

        await Book.insertMany(FinalData).then(
            res.status(201).json({
                messgae: 'Sub subject Inserted'
            })
        ).catch(error => {
            res.status(409).json({
                message: "Error occured while Inserting Data",
                errors: error.message
            });
        })

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
        await Book.findByIdAndUpdate({ _id: req.params.id }, req.body)
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

        const subject_name = parseInt(req.query.subject_name);
        const sub_subject_name = parseInt(req.query.sub_subject_name);
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const Books = await Book.find({ status: true }, { __v: 0 }).sort({created_at: -1}).limit(20);
        
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
        const Subject = await Book.findOne({ _id: req.params.id }, { __v: 0 });
        return res.status(200).json({
            data: Subject
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
            },{
                $project: {
                    sub_subject_name: 1,
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


module.exports = {
    BooksBySubSubjectId,
    getAllBook,
    createBook,
    uploadBook,
    BulkUploadBook,
    updateBook,
    deleteBook,
    viewBook,
    searchBook
}