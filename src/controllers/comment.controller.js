const { CreatedResponse, OkResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  static async createComment(req, res) {
    new CreatedResponse({
      message: "Created!",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  }

  static async getCommentsOfProduct(req, res) {
    new OkResponse({
      message: "OK",
      metadata: await CommentService.getCommentsOfProduct(req.query),
    }).send(res);
  }

  static async deleteCommentOfProduct(req, res) {
    new OkResponse({
      message: "OK",
      metadata: await CommentService.deleteCommentOfProduct(req.body),
    }).send(res);
  }
}

module.exports = CommentController;
