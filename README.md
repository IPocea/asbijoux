# Asbijoux

This is a presentation website for handmade jewelry.

This app is made with the following technologies: Angular CLI, NodeJs, Express, MySQL.

## How to get started?

- download the code
- create an .env file in backend folder where you should have the keys:
  - secret
  - key1
  - API_KEY
  - APY_KEY_COMMENTS
  - directoryPath
  - baseUrl
- in backend/app create a folder config where you should have 2 files:
  - auth.config.js - here you should export { secret: secret}
  - db.config.js - here you should export MySQL database credentials
- run npm i on both folders frontend and backend
- install angular version 13.3.0
- run commands:
 - in backend folder: node server.js
 - in frontend folder: ng serve -o
- Enjoy 
