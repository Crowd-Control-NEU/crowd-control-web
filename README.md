[![Stories in Ready](https://badge.waffle.io/Crowd-Control-NEU/crowd-control-web.svg?label=ready&title=Ready)](http://waffle.io/Crowd-Control-NEU/crowd-control-web)

# crowd-control-web
Web Application

Local Setup:
- Download and install PostgreSQL (https://www.postgresql.org/download/macosx/)
- Run the postgres server on your local machine (should be on port 5432)
- `npm install` in both root and client directories
- from root directory of project, `node server/models/db.js` to call the createDefaultTable() function (you may need to add line in file that calls the createDefaultTable() function).  This will set up the table with (id, location, count, time) where count is the number of people who entered/exit at that moment in time.
- from root directory of project, `node server/helper/populatedb.js` to clear any preexisting rows in the table and populate the table with a few rows of dummy data
- from the root directory of project, `yarn dev` to start both the react buildpack server and the node.js server
- go to localhost:3000 to see the React App

-Slack Integration Test 
