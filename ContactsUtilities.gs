/**
 * Maps a returned contact object to a structured table contact format using a provided mapping.
 * 
 * @param {Object} returnedContact - The contact object retrieved from the external source.
 * @param {Object} contactTableMapping - Mapping between contact fields and table columns.
 * @return {Object} The mapped table contact object.
 */
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

/**
 * Adds an array of table contacts to the spreadsheet, aligning values to appropriate columns.
 * 
 * @param {Array<Object>} contacts - An array of contacts structured as table rows.
 * @return {void}
 */
function addTableContactsToDataTable(contacts) {
  contacts.forEach(contact => {
    const sortedContact =
      Object
        .values(contact)
        .sort((a, b) => a.colNum - b.colNum)

    const rowData = []

    sortedContact.forEach(item => {
      rowData[item.colNum - 1] = item.value || ''
    })

    SHEET.appendRow(rowData)
  })
}

/**
 * Builds an array of contact objects from table data and column mappings.
 * 
 * @param {Array<Array<string>>} tableData - Two-dimensional array representing table rows and columns.
 * @param {Object} mapping - Mapping between table columns and contact fields.
 * @return {Array<Object>} An array of contact objects.
 */
function buildContactsFromTableData(tableData, mapping) {
  const contacts = []
  tableData.forEach(row => {
    var contact = {}
    row.forEach((cellContents, index) => {
      const colNum = index + 1
      const field = Object.keys(mapping).find(key => mapping[key].columnNumber === colNum)
      
      if (field) {
        cellContents ? contact[field] = cellContents : contact[field] = ''
      }
    })
    contacts.push(contact)
  })
  return contacts
}

/**
 * Sorts an array of table contacts alphabetically by last name, then by first name if last names are the same.
 * 
 * @param {Array<Object>} tableContacts - An array of table contact objects.
 * @return {Array<Object>} A sorted array of table contacts.
 */
function sortTableContactsAlphabetically(tableContacts) {
  return tableContacts.sort((a, b) => {
    var lastNameCompare = a.familyName.value.localeCompare(b.familyName.value)
    if (lastNameCompare !== 0)
      return lastNameCompare
    else
      return a.givenName.value.localeCompare(b.givenName.value)
  })
}

/**
 * Constructs an XML representation of a contact for external API compatibility.
 * 
 * @param {Object} contact - The contact object with fields like name, email, phone, etc.
 * @return {string} An XML string representing the contact.
 */
function buildXMLContact(contact) {
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
