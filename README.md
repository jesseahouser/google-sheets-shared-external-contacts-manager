# Shared External Contact Management via Google Sheets
This Google Apps Script project enables managing shared external contacts (Domain Shared Contacts) for a Google Workspace through a Google Sheets interface.

## Background

### What are shared external contacts (aka Domain Shared Contacts)?
These are external contacts that are shared with all users in a Google Workspace domain.

### Why are they useful?
Suppose you are part of an organization — for example, a volunteer search and rescue team — with a Google Workspace. Your team may have a Contact Directory with members and staff contacts that are within your Domain (internal contacts). It would also be convenient to have some contacts from a team in a neighboring area listed in the Contact Directory so that *anyone* in your team can easily contact them. :iphone:

### The problem
Google does not provide a user interface for managing shared external contacts (Domain Shared Contacts). :upside_down_face:

You can't simply add them to your [Contacts Directory](https://contacts.google.com/directory) directly and have them be shared across the organization. :pleading_face:

Google suggests three options for doing so:

> You can add external contacts to your Directory in 3 ways:
> * :nerd_face: [Domain Shared Contacts API](http://code.google.com/googleapps/domain/shared_contacts/gdata_shared_contacts_api_reference.html) — For admins who are comfortable with using SDKs. Use these APIs to add, edit, and delete external contacts. Before working with APIs, you need to [enable APIs access](https://support.google.com/a/answer/60757). You should also be familiar with protocol basics. Once you're comfortable with APIs, use the [code libraries](http://code.google.com/googleapps/domain/libraries_and_samples.html) for reference.
> * :money_with_wings: [Google Workspace Marketplace apps](https://www.google.com/enterprise/marketplace/search?orderBy=rating&query=) — For admins who want a user interface that doesn't require programming. Search for “shared contacts.”
> * :cloud: [Google Cloud Directory Sync](https://support.google.com/a/topic/2679497) — For admins who want to synchronize external contacts from a Microsoft Active Directory or LDAP server. Sync your shared contacts.

*(excerpt from [Google Workspace Help - Add shared external contacts to the Directory](https://support.google.com/a/answer/9281635?fl=1&sjid=12378158771792397271-NC))*

### A :free: solution
For many organizations, a cost-based app option isn't attractive, and Google Cloud Directory Sync does not match their implementation. What they *really* need is a free and easy contact management tool. This Apps Script project serves that purpose.

## Features
- Familiar Google Sheets spreadsheet interface with a simple contacts table
- Contact data can be imported in bulk via Google Sheet's existing UI
- Easy shared external contact management via the `Action` column and the `Shared External Contacts` drop-down menu

## Setup
- [ ] **Ensure you are a Workspace Administrator**: Administrator priveleges are required for this Shared Domain Contacts API auth implementation to work properly.
- [ ] **Ensure the [Workspace Directory is turned on and set properly](https://support.google.com/a/answer/60218?hl=en&fl=1&sjid=2954144558064126604-NC)**
    - Turn on the Directory.
    - Show both domain profiles and domain shared contacts.
    - Visit the [Contacts Directory](https://contacts.google.com/directory) to confirm.
- [ ] **Make a copy of this Google Sheet**: [Shared External Contacts](https://docs.google.com/spreadsheets/d/1Oi74oL-TBbNViTVd6fE4njajOlMkjJvsY37146BhNVE/edit?gid=1931459038#gid=1931459038)
- [ ] **Install the Script**: Add this Google Apps Script to your Google Sheets project.
    - In the Google Sheet copy, go to `Extensions` > `Apps Script`.
    - Copy and paste each `.gs` file from this repository into the Apps Script editor.
      - You can create separate files like you see in the repository (better if you want to make any modifications).
      - Or you can add all of the code to a single `.gs` file.
    - Save and authorize the necessary permissions.

## How to Use
Once installed, use the `Shared External Contacts` drop-down menu to get and sync contacts.

### Get contacts
`Shared External Contacts` > `Get contacts` retrieves your organization's existing shared external contacts (if any) from the directory and populates the contacts table.

### Sync contacts
`Shared External Contacts` > `Sync contacts` applies the user-specified actions (`ADD` / `UPDATE` / `DELETE` in the `Action` column) and syncs the external contacts in the spreadsheet table to your organization's shared [Contacts Directory](https://contacts.google.com/directory).

- **Add a contact**: fill out the contact info on the next blank row in the table, then select `ADD` in the `Action` column.
- **Edit a contact**: ensure that it has an ID, make the desired changes, then select `UPDATE` in the `Action` column.
- **Delete a contact**: ensure that it has an ID, then selelect `DELETE` in the `Action` column.
- When you are finished and ready to sync your changes, select `Sync contacts` from the dropdown menu.

## Contribution
Feel free to fork the repository, submit issues, or create pull requests. Contributions are always welcome!

## License
This project is licensed under the BSD 3-Clause License - see the [LICENSE](LICENSE) file for details.
