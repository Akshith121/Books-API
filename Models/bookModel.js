import mongoose from "mongoose";

const BookSchema = mongoose.Schema({
    book_id: Number,
    title: String,
    author: {
        first_name: String,
        last_name: String
    },
    pages: Number,
    genres: [String],
    rating: Number,
    plot: String,
    review: {
        name: String,
        body: String
    },
    cover: String,
    url: String
});

const Book = mongoose.model("Book", BookSchema);

export default Book;
