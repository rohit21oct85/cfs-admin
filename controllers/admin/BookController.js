const Book = require('../../models/admin/Book.js');
const csv = require('csv-parser')
const fs = require('fs')

const AllBook = async(req, res) => {
    try {
        const Subjects = await Book.find({ subject_id: req.params.subject_id }, { __v: 0 });
        return res.status(200).json({
            total: Subjects.length,
            data: Subjects
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
                        BookEdition: book.BookNameEdition,
                        Edition: book.Edition,
                        ISBN13: book.ISBN13,
                        ISBN10: book.ISBN10,
                        extra_search: book.extra_search,
                        image: book.image,
                        Author1: book.Author1,
                        status: book.status 
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
    console.log(FinalData);
    await Book.insertMany(FinalData).then(() => {
        res.status(200).send('Sub subject Inserted')
        callback()
    }).catch(error => {
        res.status(409).json({
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

        const Books = await Book.find({ status: true }, { __v: 0 }).limit(20);
        
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


module.exports = {
    AllBook,
    getAllBook,
    createBook,
    uploadBook,
    updateBook,
    deleteBook,
    viewBook
}