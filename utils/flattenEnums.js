// utils/getEnumValues.js
function flattenEnumValues(enumObj) {
  const values = [];
  for (const val of Object.values(enumObj)) {
    if (typeof val === "object") {
      values.push(...flattenEnumValues(val));
    } else {
      values.push(val);
    }
  }
  return values;
}

module.exports = flattenEnumValues;
