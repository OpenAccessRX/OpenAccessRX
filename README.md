# Project Title: OpenAccessRX Prototype Development & Feasibility Demo 

## Team Members: 
- El Brewster 
- Evelyn Bushell 
- Amde Wubshet 

--- 

## Technologies Used: 
- PostgreSQL Version 18 (pgAdmin 4 client)
- Node.js v22.21.0
- Express.js v5 
- Astro.js v5 
- all-MiniLM-L6-v2 (embedding model)
- Mistral-7B (LLM)
- pgvector 

---

## Setup-and-run instructions 

### For Setting up a Local Development Server 
1. Go to the .env file and check if the DATABASE_URL, HF_ACCESS_TOKEN, PG_USER, PG_PASSWORD, and PORT variables are filled with your local back-end information. 

2. In terminal, run npm install to install dependencies in package.json

3. Open and split a terminal 

4. In terminal window 1: run the instruction "npm run dev" to start the webpage (front end), visit this site on a web browser to test: localhost:4321  

5. In terminal window 2: run the command "node server/server.js" to start the server (back-end), visit this site on a web browser to test: localhost:5000/api/test-db

### For setting up PostgreSQL to work with our project (schema migration test)
pgvector extension files must first be installed on the system where PostgreSQL is running: 

## Technologies Used: 
- PostgreSQL Version 18 (pgAdmin 4 client)
- Node.js v22.21.0
- Express.js v5 
- Astro.js v5 
- all-MiniLM-L6-v2 (embedding model)
- Mistral-7B (LLM)
- pgvector 

## Description of chatbot key security feature 
- For the prototype, our chatbot functions to answer questions related to the policy of our online pharmacy (as seen in docs/Pharmacy_Policy.txt). The user enters a query, and the chatbot responds if it can answer with its ground truth data. 

- Everything for this chatbot is run locally in your system, so all of your user data should be safe against cyberattacks. We also have a login feature, but it isn't fully implemented yet (you can put whatever you want for the username and password). 

## Setup-and-run instructions 
### For Setting up a Local Development Server 
1. Go to the .env file and check if the DATABASE_URL, HF_ACCESS_TOKEN, PG_USER, PG_PASSWORD, and PORT variables are filled with your local server information. 

2. In terminal, run "npm install" to install dependencies in package.json

3. Open and split a terminal 

4. In terminal window 1: run the instruction "npm run dev" to start the webpage (front end), visit this site on a web browser to test: localhost:4321  

5. In terminal window 2: run the command "node server/server.js" to start the server (back-end), visit this site on a web browser to test: localhost:5000/api/test-db

### For setting up PostgreSQL to work with our project (schema migration test)
pgvector extension files must first be installed on the system where PostgreSQL is running: 

1. Stop the PostgreSQL Service: Ensure the server is not running while you modify its files.

2. Download the Extension: You typically need to download the pre-compiled binaries for your specific PostgreSQL version (e.g., PostgreSQL 15, 16) and architecture. You'll need to search for "pgvector pre-compiled binaries for Windows." (version for our technology: https://github.com/andreiramani/pgvector_pgsql_windows/releases/tag/0.8.1_18.0.2)

3. Place Files: You usually copy the necessary files (the .dll and .control files) into the PostgreSQL installation's

4. Restart the PostgreSQL Service: Restart the service after placing the files.

After installing the pgvector extensions, run the data migration javascript file (command in terminal: node .\server\rag\db\migrate.js). if there are no other complications, you should get a console log message that indicates the data migration test was successful.  
After installing the pgvector extensions, run the data migration javascript file (command in terminal: node .\server\rag\db\migrate.js). if there are no other complications, you should get a console log message that indicates the data migration test was successful.  

### For setting up the knowledge base 
After running the database migration script, you should see the "documents" table in the pgAdmin client. The last thing we have to do is feed the pharmacy policy (our relevant information) to that same table so our LLM can respond with information related to our pharmacy (command in terminal node .\server\rag\db\seed.js)
