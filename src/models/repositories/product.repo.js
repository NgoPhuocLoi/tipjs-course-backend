const { ProductModel } = require("../product.model");
const { getSelectData, unGetSelectData } = require("../../utils");
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

const findAllProducts = async ({ filter, limit, page, sort, select }) => {
  const skip = (page - 1) * limit;
  return ProductModel.find(filter)
    .sort({
      createdAt: sort === "ctime" ? -1 : 1,
    })
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
};

const findOneProduct = async ({ product_id, unselect }) => {
  return ProductModel.findById(product_id)
    .select(unGetSelectData(unselect))
    .lean();
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findOneProduct,
};
