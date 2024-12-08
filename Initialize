function onInstall(e) {
  onOpen(e)
}

function onOpen(e){
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Get contacts', 'getExternalContacts')
      .addItem('Apply changes','syncContacts')
      .addToUi()
}
