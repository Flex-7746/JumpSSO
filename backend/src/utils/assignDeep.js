function assign(left = {}, right = {}) {
  if (typeof right !== "object") {
    return left;
  }

  if (typeof left !== "object" || Array.isArray(right)) {
    return right;
  }

  Object.keys(right).forEach((key) => {
    const leftType = typeof left[key];
    const rightType = typeof right[key];

    if (rightType !== leftType || rightType !== "object") {
      left[key] = right[key];
      return;
    }

    const leftArray = Array.isArray(left[key]);
    const rightArray = Array.isArray(right[key]);

    if (leftArray || rightArray) {
      left[key] = right[key];
    } else {
      left[key] = assign(left[key], right[key]);
    }
  });

  return left;
}

module.exports = function assignDeep(...arrs) {
  return arrs.reduce((obj, item) => assign(obj, item));
};
