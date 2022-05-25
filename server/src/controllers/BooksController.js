const Book = require("../models/Book");
const User = require("../models/User");

const getBooks = async (req, res) => {
    const searchString = req.query.search.toString()

    try {
        const books = await Book.find({
             $or: [
                { title: { $regex: searchString, $options: 'i' } },
                
            ]
            });
        const page = parseInt(req.query.page) || 1;
        const pages = (books.reverse().length / 20 | 0) + 1;
        const startIndex = (page - 1) * 20;
        const endIndex = page * 20;
        res.status(200).send({
            data: books.reverse().slice(startIndex, endIndex) || "No data found",
            lastPage: endIndex >= books.reverse().length ? true : false,
            pages: pages,
            current: page
        });
        
    } catch (err) {
        res.status(500).json(err);
    }
}
const getBook = async (req, res) => {
    try {
        const book = await Book.findOne({_id:req.params.bookId});
        const user = await User.findOne({_id:book.userID}).select('avatarImg name')
        res.status(200).send({book:book,user:user});
    } catch (err) {
        res.status(500).json(err);
    }
}
module.exports={
    getBooks,
    getBook
}