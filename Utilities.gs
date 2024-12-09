function maybeClearTableData() {
  if (SHEET.getLastRow() >= FIRST_DATA_ROW_NUMBER)
    SHEET
      .getRange(
        FIRST_DATA_ROW_NUMBER,
        FIRST_DATA_COLUMN_NUMBER,
        SHEET.getLastRow() - FIRST_DATA_ROW_NUMBER + 1,
        SHEET.getLastColumn())
      .clearContent()
}

function outputValue(path, data) {
  // Handle complex path (e.g., find() or other advanced path conditions)
  if (path.includes('.find')) {
    // Split the path into the base path and the condition inside the find
    const [arrayPath, condition] = path.split('.find')

    // Extract the condition part by matching the value inside the parentheses (e.g., 'edit' or 'self')
    const conditionMatch = condition.match(/['"]([^'"]+)['"]/)  // Match values inside single or double quotes
    const linkRelCondition = conditionMatch ? conditionMatch[1] : 'edit' // Default to 'edit' if no condition is found

    // Get the array from the path
    const arrayData = getObjectByPath(arrayPath, data)

    // If it's an array, perform the find operation
    if (Array.isArray(arrayData)) {
      // Execute the find operation using the extracted condition
      const result = arrayData.find(link => link.rel === linkRelCondition)

      // Return the href from the found object or null if not found
      return result ? result.href : null
    }
  }

  // Handle array access (e.g., gd$email[0].address, gd$phoneNumber[0].$t)
  const arrayMatch = path.match(/(.*)\[(\d+)]\.(.*)/)
  if (arrayMatch) {
    const [_, arrayPath, index, subPath] = arrayMatch
    const arrayData = getObjectByPath(arrayPath, data)

    if (Array.isArray(arrayData)) {
      const item = arrayData[parseInt(index)]
      if (item) {
        return getObjectByPath(subPath, item)
      }
    }
    return null
  }

  // Handle simpler paths
  const value = getObjectByPath(path, data)

  // Return null if value is undefined, else return the value
  return value === "undefined" ? null : value
}

function getObjectByPath(path, data) {
  return path.split('.').reduce((acc, key) => {
    if (acc && acc[key] !== "undefined") {
      return acc[key];
    }
    return null;
  }, data);
}