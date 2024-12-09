# Shared External Contact Management via Google Sheets
This Google Apps Script project enables managing shared external contacts (Domain Shared Contacts) for a Google Workspace through a Google Sheets interface.

## Features
- Familiar spreadsheet interface with a simple contacts table
- Contact data can be imported via Google Sheet's existing UI
- Easy shared external contact management via `action` column and drop-down menu

## How to Use
1. **Make a copy of this Google Sheet**: ADD SHEET HERE
2. **Install the Script**: Add this Google Apps Script to your Google Sheets project.
4. **Set Up Permissions**: Ensure that the script has the appropriate permissions to access Google Contacts and modify the sheet.
5. **Use the Add-On**: Once installed, use the custom menu to get and sync contacts.

### Available Commands:
- **Get contacts**: `Extentions` > `Shared External Contacts` > `Get contacts` retrieves your organization's shared external contacts from the directory and populates the contacts table.
- **Sync contacts**: `Extentions` > `Shared External Contacts` > `Sync contacts` applies the user-specified action (`ADD` / `UPDATE` / `DELETE` in the `action` column) and syncs the external contacts to your organization's shared directory.

## Setup Instructions
1. Open your Google Sheets document.
2. Go to `Extensions` > `Apps Script`.
3. Copy and paste the script from this repository into the Apps Script editor.
4. Save and authorize the necessary permissions.

## Contribution
Feel free to fork the repository, submit issues, or create pull requests. Contributions are always welcome!

## License
This project is licensed under the  BSD 3-Clause License - see the [LICENSE](LICENSE) file for details.
