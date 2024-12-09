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
  return contactTableMapping
}
