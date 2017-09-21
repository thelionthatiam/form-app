FORM-APP:
This will be a test space for understanding forms.

Main purposes:
1. Use routes to deliver pages
2. Use post method to deliver user input
3. Use body-parse to acquire the right information from form input


Environment:
Machine -- macOS Sierra 10.12.6, 3.5GHz i5, 8GB
Node -- Node and all modules are most current, version manager is active

Final comment:
Moving this activity log to a new document called readme, to transition out of error mode.

>>Test 2app.js (success) <<
note: from here just logging the successful attempts until an intense failure
Reason -- the new body-parser app.use method was successful

Next steps --
1. two input fields and display both id's >>success 3app.js<<
2. database
  a. add pg
  b. start database server
  c. client connect to database
  d. use no constraints and write data to table
  e. continue to display input fields via post
  >>success 4app.js<<
3. basic validation
  a. change success message to display user's inputs as a successful attempt
  b. add NOT NULL constraints to form_app table
  c. change error message to display user's inputs as a failed attempt
  >>success 5app.js<<
  note: couldn't produce null because an empty string is not null
4. more realistic form with basic validation
  a. change form to send email and phone
  b. add specific constraints for validation: regex, unique
  c. same basic validation standard as step 3
  >>success 6app.js<<
5. more advanced error reporting
  a. tell user what went wrong
  b. export validator function from other file
  >>success 7app.js<<



Test 1app.js
Reason -- express v4.15.4 requires separate body-parser module

Fix --
1. ensure that all modules are up-to-date with npm install -g npm-check-updates
2. run $ncu => "All dependencies match the latest package versions :)"
3. include new standard code app.use(bodyParser.urlencoded({ extended: false }));

log:
Identical error.

Test 0app.js
Reason -- body-parser not required or defined in app, mistake
Fix -- var bodyParser = require('body-parser');
update: also did not include the deprecated requirement app.use(bodyParser());

Log:
TypeError: Cannot read property 'id' of undefined
    at /Users/juliantheberge/Documents/GitHub/form_app/app.js:10:23
    at Layer.handle [as handle_request] (/Users/juliantheberge/Documents/GitHub/form_app/node_modules/express/lib/router/la
yer.js:95:5)
    at next (/Users/juliantheberge/Documents/GitHub/form_app/node_modules/express/lib/router/route.js:137:13)
    at Route.dispatch (/Users/juliantheberge/Documents/GitHub/form_app/node_modules/express/lib/router/route.js:112:3)
    at Layer.handle [as handle_request] (/Users/juliantheberge/Documents/GitHub/form_app/node_modules/express/lib/router/la
yer.js:95:5)

    at /Users/juliantheberge/Documents/GitHub/form_app/node_modules/express/lib/router/index.js:281:22
    at Function.process_params (/Users/juliantheberge/Documents/GitHub/form_app/node_modules/express/lib/router/index.js:33
5:12)
    at next (/Users/juliantheberge/Documents/GitHub/form_app/node_modules/express/lib/router/index.js:275:10)
    at expressInit (/Users/juliantheberge/Documents/GitHub/form_app/node_modules/express/lib/middleware/init.js:40:5)
    at Layer.handle [as handle_request] (/Users/juliantheberge/Documents/GitHub/form_app/node_modules/express/lib/router/la
yer.js:95:5)
