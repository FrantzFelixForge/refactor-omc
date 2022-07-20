function isObject(obj) {
  // console.log(obj.constructor);
  return (
    typeof obj === "object" &&
    typeof obj !== "function" &&
    !Array.isArray(obj) &&
    obj !== null
  );
}

module.exports = { isObject };
