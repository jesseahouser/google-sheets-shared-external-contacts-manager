function fetchContacts(startIndex = 1) {
  console.log(`Getting external contacts, startIndex: ${startIndex}`)
  if (startIndex = 1)
    maybeClearTableData()

  const request = formRequest('get', null, startIndex)
  const response = UrlFetchApp.fetch(request.url, request.options)
  handleResponse('get', response)
}

function maybeFetchMoreContacts(tableContacts, totalNumContacts, startIndex) {
  if (tableContacts.length < totalNumContacts)
    fetchContacts(startIndex + 25)
}

function syncContacts() {
  const tableData =
    SHEET
      .getRange(
        FIRST_DATA_ROW_NUMBER,
        FIRST_DATA_COLUMN_NUMBER,
        SHEET.getLastRow() - 1,
        SHEET.getLastColumn())
      .getValues()
  const contactTableMapping = createContactTableMapping()
  const contacts = buildContactsFromTableData(tableData, contactTableMapping)
  var errorCount=''

  if (contacts) {
    console.log(`Contacts: ${contacts}`)
    for (i in contacts) {
      var rowNum = FIRST_DATA_ROW_NUMBER + parseInt(i)
      
      switch (contacts[i].action) {
        case 'ADD':
          console.log(`Adding contact {i: ${i}, rowNum: ${rowNum}}`)
          addContact(contacts[i], rowNum)
          break
        case 'UPDATE' :
          console.log(`Updating contact {i: ${i}, rowNum: ${rowNum}}`)
          updateContact(contacts[i], rowNum)
          break
        case 'DELETE' :
          console.log(`Deleting contact {i: ${i}, rowNum: ${rowNum}}`)
          deleteContact(contacts[i], rowNum)
          break
      }
    }

    if (errorCount=='') {
      console.log(`Waiting ${WAIT_TIMER_MILLISECONDS / 1000} seconds...`)
      Utilities.sleep(WAIT_TIMER_MILLISECONDS)
      console.log('Resuming')
      fetchContacts()
      SS.toast('All operations have been successful.')
    } else {
      SS.toast('There were some errors while processing the request.')
    }
  } else {
    SS.toast('No data to process.')
  }
}

function addContact(contact,rowNum) {
  console.log(`Sending request to add contact: ${contact.givenName} ${contact.familyName}`)
  const request = formRequest('post', contact, rowNum)
  const response = UrlFetchApp.fetch(request.url, request.options)
  handleResponse('post', response, rowNum)
}

function updateContact(contact, rowNum) {
  console.log(`Sending request to update contact: ${contact.givenName} ${contact.familyName}`)
  const request = formRequest('put', contact)
  const response = UrlFetchApp.fetch(request.url, request.options)
  console.log('Received response for update contact...')
  handleResponse('put', response, rowNum) 
}

function deleteContact(contact,rowNum) {
  console.log(`Sending request to delete contact: ${contact.givenName} ${contact.familyName}`)
  const request = formRequest('delete', contact)
  const response = UrlFetchApp.fetch(request.url, request.options);
  handleResponse('delete', response, rowNum)
}

function formRequest(method, contact, startIndex = null) {
  switch (method) {
    case 'get':
      var PROJECTION = `full`
      var PARAMETER = `alt=json&start-index=${startIndex}`
      var url = `${BASE_URL}/${DOMAIN}/${PROJECTION}?${PARAMETER}`

      var options = {
        method: 'get',
        contentType: 'application/atom+xml',
        headers: {
          'Authorization': 'Bearer ' + ScriptApp.getOAuthToken(),
          'GData-Version': '3.0'
        },
        muteHttpExceptions: true
      }
      break

    case 'post':
      var PROJECTION = `full`
      var url = `${BASE_URL}/${DOMAIN}/${PROJECTION}`

      var options = {
        method: 'post',
        contentType: 'application/atom+xml',
        headers: {
          'Authorization': 'Bearer ' + ScriptApp.getOAuthToken(),
          'GData-Version': '3.0'
        },
        payload: buildXML(contact),
        muteHttpExceptions: true
      }
      break
    
    case 'put':
      var url = contact.id

      var options = {
        method: "put",
        contentType: "application/atom+xml",
        headers: {
          "Authorization": "Bearer " + ScriptApp.getOAuthToken(),
          "GData-Version": "3.0",
          "If-Match":"*"
        },
        payload: buildXML(contact),
        muteHttpExceptions: true
      }
      break
    
    case 'delete':
      var url = contact.id

      var options = {
        method: "delete",
        contentType: "application/atom+xml",
        headers: {
          "Authorization": "Bearer " + ScriptApp.getOAuthToken(),
          "GData-Version": "3.0",
          "If-Match":"*"
        },
        muteHttpExceptions: true
      }
      break
  }

  return {url, options}
}

function handleResponse(method, response, rowNum = null) {
  const responseCode=response.getResponseCode()
  console.log(`{method: ${method.toString().toUpperCase()}, response code: ${responseCode}, response: ${response}}`)

  switch (method) {
    case 'get':
      const data = JSON.parse(response.getContentText())
      const totalNumContacts = parseInt(data.feed.openSearch$totalResults.$t)
      const startIndex = parseInt(data.feed.openSearch$startIndex.$t)
      const returnedContacts = data.feed.entry
      const contactTableMapping = createContactTableMapping()
      const tableContacts = []

      if (returnedContacts) {
        for (var i in returnedContacts) {
          var tableContact = mapReturnedContactToTableContact(returnedContacts[i], contactTableMapping)
          console.log(`Returned Contact #${parseInt(i) + 1}: ${JSON.stringify(tableContact)}`)
          tableContacts.push(tableContact)
        }

        maybeFetchMoreContacts(tableContacts, totalNumContacts, startIndex)
      }

      if (tableContacts.length > 0) {
        var sortedTableContacts = sortTableContactsAlphabetically(tableContacts)
        addTableContactsToDataTable(sortedTableContacts)
      }
      break

    case 'post':
    case 'put':
      if (responseCode >= 200 && responseCode < 300) {
        SHEET.getRange(rowNum, 2, 1, 1).setValue('OK')
        SHEET.getRange(rowNum, 1, 1, 1).clear()
        SpreadsheetApp.flush()
      } else {
        SHEET.getRange(rowNum, 2, 1, 1).setValue('ERROR')
        errorCount = errorCount.toString()+rowNum
      }
      break

    case 'delete':
      if (responseCode >= 200 && responseCode < 300) {
        SHEET.getRange(rowNum, 1, 1, 1).deleteRow(rowNum)
        SpreadsheetApp.flush()
      } else {
        SHEET.getRange(rowNum, 2, 1, 1).setValue('ERROR')
        errorCount = errorCount.toString()+rowNum
      }
      break
  }
}
