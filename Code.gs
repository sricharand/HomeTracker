// Deploy this as a Web App (see README.md) bound to a Google Sheet.
// It stores the entire app state as one JSON blob in cell A1 of a "Data" sheet.
// Good enough for family-scale use; not built for heavy concurrent writes.

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Data');
  if (!sheet) sheet = ss.insertSheet('Data');
  return sheet;
}

function doGet(e) {
  const sheet = getSheet_();
  const json = sheet.getRange('A1').getValue();
  const output = json && json.toString().trim() ? json : '{"title":"Home Base","categories":["General","Chores","Errands"],"todos":[],"groceries":[],"attendance":[],"salary":0,"payments":[]}';
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = getSheet_();
  const body = e.postData ? e.postData.contents : '{}';
  // Basic validation: must be parseable JSON before we store it.
  try {
    JSON.parse(body);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid JSON' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  sheet.getRange('A1').setValue(body);
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
}
