import express from "express";
import * as bookController from "../Controller/bookController.js";

const router = express.Router();

router.route("/all").get(bookController.getAllBooks);

router.route("/:id").get(bookController.getBookById);

router.route("/").get(bookController.getBooksPerPage);

router.route("/get/random").get(bookController.getRandomBook);

router.route("/find/author").get(bookController.getBooksByAuthor);

router.route("/find/title").get(bookController.getBooksByTitle);

router.route("/find/rating").get(bookController.getBooksByRating);

router.route("/find/pages").get(bookController.getBooksByPageCount);

router.route("/find/genres").get(bookController.getBooksByGenres);

router.route("/add").post(bookController.addBook);

router.route("/update/full/:id").put(bookController.replaceBookById);

router.route("/update/:id").patch(bookController.updateBook);

router.route("/delete/:id").delete(bookController.deleteBookById);

export default router;