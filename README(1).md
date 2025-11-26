## Project Title: OpenAccessRX Prototype Development & Feasibility Demo 

### Team Members: 
- El Brewster 
- Evelyn Bushell 
- Amde Wubshet 

### Technologies Used: 
- PostgreSQL Version 18 (pgAdmin 4 client)
- Node.js v22.21.0
- Express.js v5 
- Astro.js v5 
- all-MiniLM-L6-v2 (embedding model)
- Mistral-7B (LLM)
- pgvector 

### Chatbot and Key Security Feature 

### Setup and run instructions 
#### For Setting up a Local Development Server: 
1. Open and split a terminal 
2. In terminal window 1: run the instruction "npm run dev". This    
3. In terminal window 2: run the command "node server/server.js". 

#### For Setting up PostgreSQL to work with our project (data migration test)
pgvector extension files must first be installed on the system where PostgreSQL is running: 
1. Stop the PostgreSQL Service: Ensure the server is not running while you modify its files.

2. Download the Extension: You typically need to download the pre-compiled binaries for your specific PostgreSQL version (e.g., PostgreSQL 15, 16) and architecture. You'll need to search for "pgvector pre-compiled binaries for Windows." (version for our technology: https://github.com/andreiramani/pgvector_pgsql_windows/releases/tag/0.8.1_18.0.2)

3. Place Files: You usually copy the necessary files (the .dll and .control files) into the PostgreSQL installation's

4. Restart the PostgreSQL Service: Restart the service after placing the files.

After installing the pgvector extensions, run the data migration javascript file: (command in terminal: node .\server\rag\db\migrate.js) 
- 