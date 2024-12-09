function mapReturnedContactToTableContact(returnedContact, contactTableMapping) {
  var tableContact = {}

  for (const [k, v] of Object.entries(contactTableMapping)) {
    if (v.contactKey) {
      const val = outputValue(v.contactKey, returnedContact)

      tableContact[k] = {}
      tableContact[k]["colNum"] = v.columnNumber
      tableContact[k]["value"] = val
    }
  }
  return tableContact
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

function buildContactsFromTableData(tableData, mapping) {
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
