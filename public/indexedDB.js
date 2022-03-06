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

// Function that will save transactions to api database once connection is online again
function saveTransactionsToMongoDatabase() {
  console.log('saving transactions...')

  // access transactions in indexDB
  const transaction = db.transaction(['transaction'], 'readwrite');
  const budgetObjectStore = transaction.objectStore('transaction');

  // get all records from store and set to a variable
  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = function () {

    // if there was data in indexedDb's store send it to the api server
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            throw new Error(data);
          }
          // once saved, clear out all transactions
          // clear all items in your store
          const transaction = db.transaction(['transaction'], 'readwrite');
          const budgetObjectStore = transaction.objectStore('transaction');

          budgetObjectStore.clear();
          alert('All saved transactions has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}

// once the app is back online upload transactions
window.addEventListener('online', function () {
  console.log('back online!!');
  saveTransactionsToMongoDatabase()
})