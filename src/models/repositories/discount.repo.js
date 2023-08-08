const DiscountModel = require("../discount.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const findAllDiscountsSelect = async ({
  filter,
  limit = 50,
  page = 1,
  sortBy = "ctime",
  select,
}) => {
  const skip = (page - 1) * limit;
  return DiscountModel.find(filter)
    .sort({
      createdAt: sort === "ctime" ? -1 : 1,
    })
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
};

const findAllDiscountsUnselect = async ({
  filter,
  limit = 50,
  page = 1,
  sortBy = "ctime",
  unselect,
}) => {
  const skip = (page - 1) * limit;
  return DiscountModel.find(filter)
    .sort({
      createdAt: sortBy === "ctime" ? -1 : 1,
    })
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unselect))
    .lean();
};

const checkDiscountExisted = async (filter) => {
  return await DiscountModel.findOne(filter).lean();
};

module.exports = {
  findAllDiscountsSelect,
  findAllDiscountsUnselect,
  checkDiscountExisted,
};
