import Book from "../Models/bookModel.js";

const my_API_KEY = process.env.API_KEY;

//Get all Books
export const getAllBooks = async (req,res) => {
    const api_key = req.query.api_key;
    if(api_key === process.env.API_KEY){
        try{
            const books = await Book.find({});
            res.status(200).json(books);
        }catch(err){
            res.status(500).send({error: "Error fetching details of the request, please try again!"});
        }
    }
    else{
        res.status(401).json({mssg: "Unauthorized to get all books data"});
    }
}

//Get a book by its Id
export const getBookById = async (req,res) => {
    const id = req.params.id;
    try{
        const book = await Book.findOne({book_id: id});
        if(book == null){
            res.status(204).send({error: "Error fetching details of the request, please try again with a smaller id!"});
        }
        else{
            res.status(200).json(book);
        }
    }catch(err){
        res.status(400).send({error: "Error fetching details of the request, please try again!"});
    }
}

//Get books per page
export const getBooksPerPage = async (req,res) => {
    const page = (Number)(req.query.p);
    const booksPerPage = 10;
    try{
        const books = await Book.find({}).skip(page*booksPerPage).limit(booksPerPage);
        res.status(200).json(books);
    }catch(err){
        res.status(404).send({error: "Error fetching details of the requested page, try a smaller page number!"});
    }
}

//Get a random book
export const getRandomBook = async (req,res) => {
    try{
        const books = await Book.find({});
        if(books.length !== 0){
            const size = books.length;
            const randomNum = Math.floor(Math.random()*size);
            res.status(200).json(books[randomNum]);
        }
        else{
            res.status(500).json({error: "Error fetching details of the request, please try again after some time!"})
        }
    }catch(err){
        res.status(400).send({error: "Error fetching details of the request, please try again!"});
    }
}

//Get books by Author name
export const getBooksByAuthor = async (req, res) => {
    let fname = req.query.fname;
    let lname = req.query.lname;
    if(fname != null){
        fname = fname.substring(0, 1).toUpperCase() + fname.substring(1).toLowerCase();
    }
    if(lname != null){
        lname = lname.substring(0, 1).toUpperCase() + lname.substring(1).toLowerCase();
    }
    if(fname != null && lname != null){
        try{
            const books = await Book.find({"author.first_name": fname, "author.last_name": lname});
            res.status(200).json(books);
         }catch(err){
             res.status(500).send({error: "Error fetching details of the request, please try again!"});
         }
    }
    else if(fname != null || lname != null){
        try{
            const books = await Book.find({$or: [{"author.first_name": fname}, {"author.last_name": lname}]});
            res.status(200).json(books);
        }catch(err){
            res.status(500).send({error: "Error fetching details of the request, please try again!"});
        }
    }
    else{
        res.status(400).json({error: "Please check your request and try again!"});
    }
}

//Get books by title
export const getBooksByTitle = async (req, res) => {
    let title = req.query.title;
    try{
        const books = await Book.find({title: new RegExp(`^${title}$`, 'i')});
        res.status(200).json(books);
     }catch(err){
        res.status(500).send({error: "Error fetching details of the request, please try again!"});
     }

}

//Get books by their rating
export const getBooksByRating = async (req, res) => {
    const lte = req.query.lte || 5;
    const gte = req.query.gte || 0;
    const page = (Number)(req.query.p);
    const booksPerPage = 5;
    try{
        const books = await Book.find({$and: [{rating: {$gte: gte}}, {rating: {$lte: lte}}]}).skip(page*booksPerPage).limit(booksPerPage);
        res.status(200).json(books);
    }catch(err){
        res.status(500).send({error: "Error fetching details of the request, please try again!"});
    }
}

//Get books by number of pages
export const getBooksByPageCount = async (req, res) => {
    const lte = req.query.lte || Number.MAX_VALUE;
    const gte = req.query.gte || 0;
    const page = (Number)(req.query.p);
    const booksPerPage = 5;
    try{
        const books = await Book.find({$and: [{pages: {$gte: gte}}, {pages: {$lte: lte}}]}).skip(page*booksPerPage).limit(booksPerPage);
        res.status(200).json(books);
    }catch(err){
        res.status(500).send({error: "Error fetching details of the request, please try again!"});
    }
}

//Get books by their genres
export const getBooksByGenres = async (req, res) => {
    let genres = req.query.genres;
    if(genres !== undefined){
        for(let i=0;i<genres.length;i++){
            genres[i] = genres[i].split(" ");
            for(let j=0;j<genres[i].length;j++){
                genres[i][j] = genres[i][j].substring(0, 1).toUpperCase() + genres[i][j].substring(1).toLowerCase();
            }
            genres[i] = genres[i].join(" "); 
        }
        try{
            const books = await Book.find({genres: {$all: genres}});
            res.status(200).json(books);
        }catch(err){
            res.status(500).send({error: "Error fetching details of the request, please try again!"});
        }
    }
    else{
        res.status(400).json({error: "Error fetching details, please try again after reformatting the request!"});
    }
}

//Post a book
export const addBook = async (req,res) => {
    const api_key = req.query.api_key;
    if(api_key === process.env.API_KEY){
        try{
            const books = await Book.find({});
            const id = books[books.length - 1].book_id + 1;   
            const newBook = new Book({
                book_id: id,
                title: req.body.title,
                author: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name
                },
                pages: req.body.pages,
                genres: req.body.genres,
                rating: req.body.rating,
                plot: req.body.plot,
                review: {
                    name: req.body.name,
                    body: req.body.body
                },
                cover: req.body.cover,
                url: req.body.url
            });
    
            newBook.save();
            res.status(201).send({mssg: "Successfully posted data of new book"});
        }catch(err){
            res.status(500).send({error: "Error posting the details of the book, please try again!"});
        }
    }
    else{
        res.status(401).json({mssg: "Unauthorized to post"});
    }
}

//Replace a book
export const replaceBookById = async (req,res) => {
    const id = req.params.id;
    const api_key = req.query.api_key;
    const sentBook = req.body;
    if(api_key === process.env.API_KEY){
        try{ 
            const book = await Book.findOne({book_id: id}); 
            if(book == null){
                const newBook = new Book({
                    book_id: id,
                    ...sentBook
                }); 
                newBook.save();
                res.status(201).send({mssg: "Updated successfully"});
            }
            else{
                const updatedBook = await Book.updateOne({book_id: id}, {
                    title: req.body.title || book.title,
                    author: {
                        first_name: req.body.first_name || book.author.first_name,
                        last_name: req.body.last_name  || book.author.last_name
                    },
                    pages: req.body.pages || book.pages,
                    genres: req.body.genres || book.genres,
                    rating: req.body.rating || book.rating,
                    plot: req.body.plot || book.plot,
                    review: {
                        name: req.body.name || book.review.name,
                        body: req.body.body || book.review.body
                    },
                    cover: req.body.cover || book.cover,
                    url: req.body.url || book.url
                   });
                res.status(201).send({mssg: "Updated successfully"});
            }
        }catch(err){
            res.status(400).send({error: "Error updating the details of the book, please try again!"});
        }
    }
    else{
        res.status(401).json({mssg: "Unauthorized to update"});
    }
}

//Update a book
export const updateBook = async (req,res) => {
    const id = req.params.id;
    const api_key = req.query.api_key;
    if(api_key === process.env.API_KEY){
        const findBook = await Book.findOne({book_id: id});
        if(findBook !== null){
            try{
                const book = await Book.updateOne({book_id: id}, {
                 title: req.body.title || findBook.title,
                 author: {
                     first_name: req.body.first_name || findBook.author.first_name,
                     last_name: req.body.last_name  || findBook.author.last_name
                 },
                 pages: req.body.pages || findBook.pages,
                 genres: req.body.genres || findBook.genres,
                 rating: req.body.rating || findBook.rating,
                 plot: req.body.plot || findBook.plot,
                 review: {
                     name: req.body.name || findBook.review.name,
                     body: req.body.body || findBook.review.body
                 },
                 cover: req.body.cover || findBook.cover,
                 url: req.body.url || findBook.url
                });
                res.status(200).send({mssg: "Updated successfully"});
             }catch(err){
                 res.status(400).send({error: "Error updating the details of the book, please try again with a lower id!"});
             }
        }
        else{
            res.status(500).json({mssg: "Error updating the details of the book, please try again with a lower id!"});
        }
    }
    else{
        res.status(401).json({mssg: "Unauthorized to update"});
    }
    
}

//Delete a book
export const deleteBookById = async (req,res) => {
    const id = req.params.id;
    const api_key = req.query.api_key;
    if(api_key === my_API_KEY){
        const size = await Book.find({}).count();
        if(id <= size){
           try{
             const deletedBook = await Book.deleteOne({book_id: id});
             res.status(200).send({mssg: "successfully deleted a book!"});
            }catch(err){
             res.status(500).send({err: "Error deleting the book, please try again!"});
            }
        }
        else{
            res.status(400).json({error: "There was an error deleting the book, please try again with a lower id!"});
        }
    }
    else{
        res.status(401).json({mssg: "Unauthorized to delete"});
    }
}