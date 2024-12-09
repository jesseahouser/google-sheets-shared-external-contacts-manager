/**
 * Triggered when the add-on is installed. It calls the onOpen function to set up the add-on menu.
 *
 * @param {Object} e - Event object passed to the function.
 */
function onInstall(e) {
  onOpen(e)
}

/**
 * Triggered when the spreadsheet is opened. Sets up the custom menu in the Google Sheets UI.
 * Adds options to the menu for retrieving external contacts and applying changes.
 *
 * @param {Object} e - Event object passed to the function.
 */
function onOpen(e){
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Get contacts', 'fetchContacts')
      .addItem('Sync contacts','syncContacts')
      .addToUi()
}
