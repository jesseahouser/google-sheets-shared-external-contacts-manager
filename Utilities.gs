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

function createContactTableMapping() {
  const contactTableMapping = {
    action: {
      columnHeader: "Action"
    },
    validation: {
      columnHeader: "Validation"
    },
    id: {
      contactKey: "link.find(link => link.rel === 'edit').href",
      columnHeader: "Id"},
    givenName: {
      contactKey: "gd$name.gd$givenName.$t",
      columnHeader: "First Name"},
    familyName: {
      contactKey: "gd$name.gd$familyName.$t",
      columnHeader: "Last Name"},
    organizationName: {
      contactKey: "gd$organization[0].gd$orgName.$t",
      columnHeader: "Organization Name"},
    organizationTitle: {
      contactKey: "gd$organization[0].gd$orgTitle.$t",
      columnHeader: "Organization Title"},
    organizationDepartment: {
      contactKey: "gd$organization[0].gd$orgDepartment.$t",
      columnHeader: "Organization Department"},
    notes: {
      contactKey: "content.$t",
      columnHeader: "Notes"},
    primaryEmailLabel: {
      contactKey: "gd$email[0].label",
      columnHeader: "E-mail 1 - Label"},
    primaryEmail: {
      contactKey: "gd$email[0].address",
      columnHeader: "E-mail 1 - Value"},
    secondaryEmailLabel: {
      contactKey: "gd$email[0].label",
      columnHeader: "E-mail 2 - Label"},
    secondaryEmail: {
      contactKey: "gd$email[1].address",
      columnHeader: "E-mail 2 - Value"},
    primaryPhoneLabel: {
      contactKey: "gd$phoneNumber[0].label",
      columnHeader: "Phone 1 - Label"},
    primaryPhone: {
      contactKey: "gd$phoneNumber[0].$t",
      columnHeader: "Phone 1 - Value"},
    secondaryPhoneLabel: {
      contactKey: "gd$phoneNumber[1].label",
      columnHeader: "Phone 2 - Label"},
    secondaryPhone: {
      contactKey: "gd$phoneNumber[1].$t",
      columnHeader: "Phone 2 - Value"},
    primaryAddressLabel: {
      contactKey: "gd$structuredPostalAddress[0].label",
      columnHeader: "Address 1 - Label"},
    primaryAddressStreet: {
      contactKey: "gd$structuredPostalAddress[0].gd$street.$t",
      columnHeader: "Address 1 - Street"},
    primaryAddressCity: {
      contactKey: "gd$structuredPostalAddress[0].gd$city.$t",
      columnHeader: "Address 1 - City"},
    primaryAddressPOBox: {
      contactKey: "gd$structuredPostalAddress[0].gd$pobox.$t",
      columnHeader: "Address 1 - PO Box"},
    primaryAddressRegion: {
      contactKey: "gd$structuredPostalAddress[0].gd$region.$t",
      columnHeader: "Address 1 - Region"},
    primaryAddressPostalCode: {
      contactKey: "gd$structuredPostalAddress[0].gd$postcode.$t",
      columnHeader: "Address 1 - Postal Code"},
    primaryAddressCountry: {
      contactKey: "gd$structuredPostalAddress[0].gd$country.$t",
      columnHeader: "Address 1 - Country"},
  }

  const headerRowRange = SHEET.getRange(HEADER_ROW_NUMBER, 1, 1, SHEET.getLastColumn())

  for (i in contactTableMapping) {
    var headerRowTextSearchResult = 
      headerRowRange
        .createTextFinder(contactTableMapping[i].columnHeader)
        .matchEntireCell(true)
        .findNext()
    
    // Only set the 'columnNumber' if the 'columnHeader' text is found in the 'headerRow'
    headerRowTextSearchResult
      ? contactTableMapping[i].columnNumber = headerRowTextSearchResult.getColumn()
      : null
  }
  console.log(`contactTableMapping: ${contactTableMapping}`)
  return contactTableMapping
}

function mapReturnedContactToTableContact(returnedContact, contactTableMapping) {
  Logger.log(returnedContact)
  var tableContact = {}

  for (const [k, v] of Object.entries(contactTableMapping)) {
    // Call outputValue with v.contactKey as a string
    if (v.contactKey) {
      const val = outputValue(v.contactKey, returnedContact);

      // Store the result in tableContact
      tableContact[k] = {}
      tableContact[k]["colNum"] = v.columnNumber
      tableContact[k]["value"] = val
    }
  }
  return tableContact
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

function addTableContactsToDataTable(contacts) {
  contacts.forEach(contact => {
    // Convert the contact object to an array of its values and sort by colNum
    const sortedContact = Object.values(contact).sort((a, b) => a.colNum - b.colNum)

    // Create an array to hold the data in the correct column positions
    const rowData = []

    // Place data in the appropriate column index
    sortedContact.forEach(item => {
      // Ensure the rowData array is large enough to accommodate the highest colNum
      // colNum is 1-based, so we use colNum - 1 for 0-based indexing
      rowData[item.colNum - 1] = item.value || ''; // Use empty string if value is null
    })

    // Insert the data into a new row (or specify a different row if needed)
    SHEET.appendRow(rowData)
  })
}

// Sort by last name, then first name (if last names are the same)
function sortTableContactsAlphabetically(tableContacts) {
  return tableContacts.sort((a, b) => {
    var lastNameCompare = a.familyName.value.localeCompare(b.familyName.value)
    if (lastNameCompare !== 0)
      return lastNameCompare
    else
      return a.givenName.value.localeCompare(b.givenName.value)
  })
}

function buildContactsFromTableData(tableData, mapping) {
  Logger.log(tableData)
  Logger.log(mapping)
  const contacts = []
  tableData.forEach(row => {
    var contact = {}
    console.log(`row: ${row}`)
    row.forEach((cellContents, index) => {
      // Find the mapping where columnNumber == colNum
      const colNum = index + 1
      const field = Object.keys(mapping).find(key => mapping[key].columnNumber === colNum)
      
      if (field) {
        // Save the cellContents to the appropriate contact field
        cellContents ? contact[field] = cellContents : contact[field] = ''
      }
    })
    contacts.push(contact)
  })
  return contacts
}

function buildXML(contact) {
  return "<atom:entry xmlns:atom='http://www.w3.org/2005/Atom'\
        xmlns:gd='http://schemas.google.com/g/2005'>\
      <atom:category scheme='http://schemas.google.com/g/2005#kind'\
        term='http://schemas.google.com/contact/2008#contact' />\
      <id>"+contact.id+"</id>\
      <gd:name>\
        <gd:givenName>"+contact.givenName+"</gd:givenName>\
        <gd:familyName>"+contact.familyName+"</gd:familyName>\
      </gd:name>\
      <atom:content type='text'>"+contact.notes+"</atom:content>\
      <gd:organization rel='http://schemas.google.com/g/2005#work' label='Work' primary='true'>\
        <gd:orgName>"+contact.organizationName+"</gd:orgName>\
        <gd:orgTitle>"+contact.organizationTitle+"</gd:orgTitle>\
        <gd:orgDepartment>"+contact.organizationDepartment+"</gd:orgDepartment>\
      </gd:organization>\
      <gd:email rel='http://schemas.google.com/g/2005#work' primary='true' address='"+contact.primaryEmail+"' displayName='"+contact.givenName+" "+contact.familyName+"' />\
      <gd:email rel='http://schemas.google.com/g/2005#home' address='"+contact.secondaryEmail+"' />\
      <gd:phoneNumber rel='http://schemas.google.com/g/2005#work' primary='true'>"+contact.primaryPhone+"</gd:phoneNumber>\
      <gd:phoneNumber rel='http://schemas.google.com/g/2005#home'>"+contact.secondaryPhone+"</gd:phoneNumber>\
      <gd:structuredPostalAddress rel='http://schemas.google.com/g/2005#work' primary='true'>\
        <gd:city>"+contact.primaryAddressCity+"</gd:city>\
        <gd:street>"+contact.primaryAddressStreet+"</gd:street>\
        <gd:region>"+contact.primaryAddressRegion+"</gd:region>\
        <gd:pobox>"+contact.primaryAddressPOBox+"</gd:pobox>\
        <gd:postcode>"+contact.primaryAddressPostalCode+"</gd:postcode>\
        <gd:country>"+contact.primaryAddressCountry+"</gd:country>\
        <gd:formattedAddress>"+contact.primaryAddressStreet+" "+contact.primaryAddressCity+"</gd:formattedAddress>\
      </gd:structuredPostalAddress>\
    </atom:entry>"
}
