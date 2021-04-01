const Book = require('../../models/admin/Book.js');

const addReview = async (req, res) => {
    // return res.send(req.params.isbn);
    try {
        const content = {rating: req.body.rating,review: req.body.review, name:req.body.name};
        const filter = {ISBN13: req.params.isbn};
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
module.exports = {
    addReview,
}