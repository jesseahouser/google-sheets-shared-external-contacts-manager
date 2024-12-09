/**
 * The name of the sheet where external contacts are stored.
 * The value should be set based on your Google Sheet.
 * 
 * @constant {string}
 */
const SHEET_NAME = 'External Contacts'

/**
 * The row number where the headers are located in the contacts sheet.
 * The value should be set based on your Google Sheet.
 * 
 * @constant {number}
 */
const HEADER_ROW_NUMBER = 1

/**
 * The row number where the first row of data starts in the contacts sheet.
 * The value should be set based on your Google Sheet.
 * 
 * @constant {number}
 */
const FIRST_DATA_ROW_NUMBER = 2

/**
 * The column number where the first column of data begins in the contacts sheet.
 * The value should be set based on your Google Sheet.
 * 
 * @constant {number}
 */
const FIRST_DATA_COLUMN_NUMBER = 1

/**
 * The amount of time (in milliseconds) to wait before retrying an operation.
 * The value should be set based on your preference.
 * 
 * @constant {number}
 */
const WAIT_TIMER_MILLISECONDS = 5000

/**
 * The active spreadsheet instance for interacting with Google Sheets.
 * 
 * @constant {SpreadsheetApp.Spreadsheet}
 */
const SS = SpreadsheetApp.getActiveSpreadsheet()

/**
 * The sheet object representing the "External Contacts" sheet in the active spreadsheet.
 * 
 * @constant {GoogleAppsScript.Spreadsheet.Sheet}
 */
const SHEET = SS.getSheetByName(SHEET_NAME)

/**
 * The base URL for accessing the Google Domain Shared Contacts API.
 * 
 * @constant {string}
 */
const BASE_URL = 'https://www.google.com/m8/feeds/contacts'

/**
 * The domain part of the email address of the currently authenticated user.
 * This is extracted from the user's email.
 * 
 * @constant {string}
 */
const DOMAIN = Session.getEffectiveUser().getEmail().split("@")[1]
