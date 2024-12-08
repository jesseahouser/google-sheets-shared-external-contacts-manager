// Set values corresponding to your Google Sheet
const SHEET_NAME = 'External Contacts'
const HEADER_ROW_NUMBER = 1
const FIRST_DATA_ROW_NUMBER = 2
const FIRST_DATA_COLUMN_NUMBER = 1
const WAIT_TIMER_MILLISECONDS = 10000

// Convenient identifiers
const SS = SpreadsheetApp.getActiveSpreadsheet()
const SHEET = SS.getSheetByName(SHEET_NAME)
const BASE_URL = 'https://www.google.com/m8/feeds/contacts'
const DOMAIN = Session.getEffectiveUser().getEmail().split("@")[1]
