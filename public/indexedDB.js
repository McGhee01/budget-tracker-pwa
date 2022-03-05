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

  // create an object store (table) called `new_transaction`, set it to have an auto incrementing primary key of sorts
  db.createObjectStore('new_transaction', { autoIncrement: true });
};

