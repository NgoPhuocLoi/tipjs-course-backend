const _ = require("lodash");
const getInfoData = (object = {}, fields = []) => {
  return _.pick(object, fields);
};

const getSelectData = (selectArr) =>
  Object.fromEntries(selectArr.map((e) => [e, 1]));
const unGetSelectData = (selectArr) =>
  Object.fromEntries(selectArr.map((e) => [e, 0]));

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
};
