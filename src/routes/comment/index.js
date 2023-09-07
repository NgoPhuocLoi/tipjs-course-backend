const router = require("express").Router();
const CommentController = require("../../controllers/comment.controller");
const { asyncHandler } = require("../../helpers/handleError");
const { authentication } = require("../../middlewares/auth");

router.use(authentication);

router.get("/", asyncHandler(CommentController.getCommentsOfProduct));
router.post("/", asyncHandler(CommentController.createComment));
router.delete("/", asyncHandler(CommentController.deleteCommentOfProduct));

module.exports = router;
