/*
  =========================
  ContactsApp.getContacts()
  =========================
  For OAuth2 to be scoped properly, the above line must be
  both present in the file and commented out (so as not to execute).
  If this is ommitted, HTTP requests to the Shared Domain Contacts API
  will result in the following response:
    {
      "error": {
        "code": 403,
        "message": "Request had insufficient authentication scopes.",
        "status": "PERMISSION_DENIED",
        "details": [
          {
            "@type": "type.googleapis.com/google.rpc.ErrorInfo",
            "reason": "ACCESS_TOKEN_SCOPE_INSUFFICIENT",
            "domain": "googleapis.com",
            "metadata": {
              "method": "google.contacts.v7.LegacyContacts.ContactsList",
              "service": "contacts.googleapis.com"
            }
          }
        ]
      }
    }

  Admittedly, this is a convenient workaround in lieu of implementing
  more complex scoping solutions.
  
  The root cause of this behavior might be a consequence of the following:
    - the Contacts API has been deprecated
      (https://developers.google.com/apps-script/reference/contacts/contacts-app)
    - the Shared Domain Contacts API remains active as an
      orphaned remanant of the Contacts API
      (https://developers.google.com/people/contacts-api-migration)
    - having the text present in the file forces the Apps Script project
      to automatically scope the auth appropriately
*/
