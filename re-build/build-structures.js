remoteBuilder() {
  if () { // admin config exists
    if() { // connect config exists
      // ask new tables or delete database
      if () { // new tables
        // make new tables
      } else if () { // delete database
        // delete database
        // remove connect config file
        // create db and tables
      }
    } else { // only admin exists
      // ask fresh database or remove config
      if () { // newDB
        // use admin db or new db
      } else if () { // delete admin config
        // delete admin
      } else {
        // error
      }
    }
  } else { // no configs exist
    // ask for admin configs
    // record admin configs
    // use admin db or create new db
  }
}

localBuilder() {
  if () { // connect config exists
    // ask new tables or delete database
    if () { // if new tables
      // make tables
    } else { // delete database
      // delete database
      // remove connect config file
      // create db and tables
    }
  } else { // no configs exist
    // ask if use existing db or new db
    if () { // use existing database
      // input database
      // create config
    } else if () { // make new database
      // define
      // create config
    }
  }
}


// add all error options
// change to call backs
// make sensible functions


// trying to use same structure
simpleBuilder () {
  if (adminConfig) {
    if (dbConfig) {
      promptAsk
      if(promptAsk) {

      } else if (promptAskOther) {

      } else {

      }
    }
  } else {
    promptAsk
    if(promptAsk) {

    } else if (promptAskOther) {

    } else {

    }
  }
} else {
  promptAsk
  if (promptAsk) {
    tableBuild(cb)
  } else if (promtAskOther) {
    tableanddb(cb)
  } else {

  }
}
