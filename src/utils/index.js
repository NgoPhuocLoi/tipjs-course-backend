const _ = require("lodash");
const getInfoData = (object = {}, fields = []) => {
  return _.pick(object, fields);
};

const getSelectData = (selectArr) =>
  Object.fromEntries(selectArr.map((e) => [e, 1]));
const unGetSelectData = (selectArr) =>
  Object.fromEntries(selectArr.map((e) => [e, 0]));

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) delete obj[key];
    else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const res = updateNestedObjectParser(obj[key]);
      Object.keys(res).forEach((subkey) => {
        final[`${key}.${subkey}`] = res[subkey];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  updateNestedObjectParser,
};
