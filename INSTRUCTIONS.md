Instructions
============

Congratulations!  You've downloaded MIST and you want to get it running.
Here are some basic instructions that we hope will allow you to do just
that.

Prerequisites
-------------
- Install npm (node package manager).
- Run a local MongoDB server. Follow these instructions (https://docs.mongodb.com/manual/administration/install-community/) to install the Community server. We also recommend downloading MongoDB Compass (https://www.mongodb.com/products/compass) to view your database. If you experience issues connecting to MongoDB (e.g., through Compass or when running npm start), check that the MongoDB server is running on your machine. If you would like to have sample data in your local database, please read the instructions in the sample-database folder. This sample data will allow you to see example users, images, and comments in the MIST website.
- Run "npm install" from the backend folder.
- Run "npm install" from the frontend folder.

Running MIST as a Developer
--------------------
- Run "npm run dev" in the backend folder.
- This should start the server via nodemon and the react-server

Running MIST locally
--------------------
- Run "npm start" in the backend folder.
- When you see "running on port 8000" in the terminal, move to another terminal, and run "npm start" in the frontend folder.
- Open localhost:3000 to access MIST.

Runing MIST on a server
-----------------------
