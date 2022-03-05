let db;

// check to see if indexedDB is supported in this browser
if (self.indexedDB) {
  console.log('IndexDB is supported');
}

// Create budget tracker db indexedDB api
const request = indexedDB.open('budget_tracker', 1);

// this event will emit if the database version changes
request.onupgradeneeded = function (event) {

  // save a reference to the database
  const db = event.target.result;

  // create an object store (table) called `transaction`, set it to have an auto incrementing primary key of sorts
  db.createObjectStore('transaction', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function (event) {
  console.log('successfully connected to indexedDB budget_tracker');
  db = event.target.result;
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

// If no internet connection, save it to indexedDB database for the time being
function saveRecord(record) {
  const transaction = db.transaction(['transaction'], 'readwrite');
  // access transaction object store created above
  const budgetObjectStore = transaction.objectStore('transaction');

  // add record using indexedDB get API
  budgetObjectStore.add(record);
}