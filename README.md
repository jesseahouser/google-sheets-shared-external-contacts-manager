# Shared External Contact Management via Google Sheets
This Google Apps Script project enables managing shared external contacts (Domain Shared Contacts) for a Google Workspace through a Google Sheets interface.

## Background

### The problem
Google does not provide a user interface for managing shared external contacts (Domain Shared Contacts). Google suggests three options for doing so:

> You can add external contacts to your Directory in 3 ways:
> * [Domain Shared Contacts API](http://code.google.com/googleapps/domain/shared_contacts/gdata_shared_contacts_api_reference.html) — For admins who are comfortable with using SDKs. Use these APIs to add, edit, and delete external contacts. Before working with APIs, you need to [enable APIs access](https://support.google.com/a/answer/60757). You should also be familiar with protocol basics. Once you're comfortable with APIs, use the [code libraries](http://code.google.com/googleapps/domain/libraries_and_samples.html) for reference.
> * [Google Workspace Marketplace apps](https://www.google.com/enterprise/marketplace/search?orderBy=rating&query=) — For admins who want a user interface that doesn't require programming. Search for “shared contacts.”
> * [Google Cloud Directory Sync](https://support.google.com/a/topic/2679497) — For admins who want to synchronize external contacts from a Microsoft Active Directory or LDAP server. Sync your shared contacts.

*(excerpt from [Google - Add shared external contacts to the Directory](https://support.google.com/a/answer/9281635?fl=1&sjid=12378158771792397271-NC))*

### A solution
For many organizations, a cost-based option isn't attractive, and Google Cloud Directory Sync does not match their implementation. What they *really* need is a free, easy shared external contact management tool.

## Features
- Familiar spreadsheet interface with a simple contacts table
- Contact data can be imported in bulk via Google Sheet's existing UI
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
