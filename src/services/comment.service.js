const CommentModel = require("../models/comment.model");
const { NotFoundError } = require("../core/error.response");

class CommentService {
  static async createComment({ productId, content, parentId }) {
    if (parentId) {
      const parentComment = await CommentModel.findById(parentId).lean();
      if (!parentComment) throw new NotFoundError("Parent comment not found!");
      const maxVal = parentComment.comment_right;

      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_right: {
            $gte: maxVal,
          },
        },
        {
          $inc: {
            comment_right: 2,
          },
        }
      );

      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_left: {
            $gt: maxVal,
          },
        },
        {
          $inc: {
            comment_left: 2,
          },
        }
      );
      const comment = await CommentModel.create({
        comment_productId: productId,
        comment_content: content,
        comment_left: maxVal,
        comment_right: maxVal + 1,
        comment_parentId: parentId,
      });

      return { comment };
    }
    let maxVal = 1;
    const commentWithMaxRightValue = await CommentModel.findOne({
      comment_productId: productId,
    })
      .sort({ comment_right: -1 })
      .lean();
    if (commentWithMaxRightValue)
      maxVal = commentWithMaxRightValue.comment_right;

    const comment = await CommentModel.create({
      comment_productId: productId,
      comment_content: content,
      comment_left: maxVal,
      comment_right: maxVal + 1,
      comment_parentId: null,
    });

    return { comment };
  }

  static async getCommentsOfProduct({ productId, parentId = null }) {
    const query = {
      comment_productId: productId,
      comment_parentId: parentId,
    };
    if (parentId) {
      const parentComment = await CommentModel.findById(parentId).lean();
      if (!parentComment) throw NotFoundError("Parent Comment not found!");
      query.comment_left = {
        $gt: parentComment.comment_left,
      };
      query.comment_right = {
        $lt: parentComment.comment_right,
      };
    }

    const comments = await CommentModel.find(query).lean();

    return { comments };
  }

  static async deleteCommentOfProduct({ productId, commentId }) {
    // check if the product is existed..

    const comment = await CommentModel.findById(commentId).lean();
    if (!comment) throw new NotFoundError("Comment not found!");

    const leftVal = comment.comment_left;
    const rightVal = comment.comment_right;

    const width = rightVal - leftVal + 1;

    // Delete all the subcomments have left >= comment.left && left < comment.right

    await CommentModel.deleteMany({
      comment_productId: productId,
      comment_left: {
        $gte: leftVal,
        $lte: rightVal,
      },
    });

    // Decrease left and right of all the comments which have left > rightVal by with

    await CommentModel.updateMany(
      {
        comment_productId: productId,
        comment_left: {
          $gt: rightVal,
        },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );

    await CommentModel.updateMany(
      {
        comment_productId: productId,
        comment_right: {
          $gt: rightVal,
        },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );

    return true;
  }
}

module.exports = CommentService;
