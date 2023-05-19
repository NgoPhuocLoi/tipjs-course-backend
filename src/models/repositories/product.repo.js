const { ProductModel } = require("../product.model");

const queryProducts = async ({ query, limit, skip }) => {
  return await ProductModel.find(query)
    .populate("product_shop", "name email -_id")
    .skip(skip)
    .limit(limit)
    .sort("-createdAt")
    .lean();
};

const findAllDraftsForShop = async ({ shopId, limit, skip }) => {
  const query = { product_shop: shopId, isDraft: true };
  return await queryProducts({ query, limit, skip });
};

const findAllPublishedForShop = async ({ shopId, limit, skip }) => {
  const query = { product_shop: shopId, isPublished: true };
  return await queryProducts({ query, limit, skip });
};

const publishProductByShop = async ({ shopId, productId }) => {
  const filter = { product_shop: shopId, _id: productId };
  const product = await ProductModel.findOne(filter);

  if (!product) return null;
  product.isPublished = true;
  product.isDraft = false;
  const { modifiedCount } = await product.update(product);

  return modifiedCount;
};

const unPublishProductByShop = async ({ shopId, productId }) => {
  const filter = { product_shop: shopId, _id: productId };
  const product = await ProductModel.findOne(filter);

  if (!product) return null;
  product.isPublished = false;
  product.isDraft = true;
  const { modifiedCount } = await product.update(product);

  return modifiedCount;
};

const searchProductsByUser = async ({ textSearch }) => {
  const regexSearch = new RegExp(textSearch);
  const results = await ProductModel.find(
    {
      isPublished: true,
      $text: { $search: regexSearch },
    },
    {
      score: { $meta: "textScore" },
    }
  )
    .sort({
      score: { $meta: "textScore" },
    })
    .lean();

  return results;
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
};
