# AI Chatbot: "OpenAccessRX" Prototype Development & Feasibility  

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

<img width="1773" height="1502" alt="Screenshot 2025-12-10 142118" src="https://github.com/user-attachments/assets/b5767db0-af0c-4789-a8ce-fe07aee20767" />

---

## Run the Demo on Your Machine

### 1. Setup & Installation: Software Checks

1. Ensure Node.js environment is ready for coding. Open a Terminal and run these commands to check that Node, nvm, and npm are installed:
      ```
      node -v
      nvm -v
      npm -v
      ```
2. If you still need installs for the environment:
  - To install **Node.js** on a **Windows** machine, install `nvm` [from here](https://github.com/coreybutler/nvm-windows/releases) and use Corey's [helpful README](https://github.com/coreybutler/nvm-windows?tab=readme-ov-file)
  - To install `nvm` for **Mac** go [here](https://github.com/nvm-sh/nvm)
  - Once `nvm` is installed, use the it to install node.
  - Go [here](https://nodejs.org/en/download) for alternative ways to install **Node.js**.
  - [To install](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) `npm` run `npm install -g npm`

### 2. Setup & Installation: Project Setup & Front-end Startup

1. Click "Fork" on GitHub or clone directly: `git clone git@github.com:OpenAccessRX/OpenAccessRX.git`
2. Then open the project folder in your terminal: `cd openaccessrx`
3. In terminal, run `npm install` to install dependencies in `package.json`
4. Then run `npm run dev` to run the Astro app in your browser.
5. Navigate to [localhost:4321/chat](http://localhost:4321/) to see that the site is running.
   
### 3. Setup & Installation: Local Environment Variables Setup

6. In the root of the project, create a new file `.env`
7. Copy contents of template `.env.example` into the `.env` file
8. Ensure DATABASE_URL, HF_ACCESS_TOKEN, PG_USER, PG_PASSWORD, and PORT variables are filled with your local back-end information.

### 4. Setup & Installation: Local Database Setup

#### Setting up PostgreSQL: Schema Migration Test
1. Stop PostgreSQL. Since `pgvector` extension files must first be installed on the system where PostgreSQL is running, stop PostgreSQL service on your machine. Ensure the server is not running while you modify its files.
2. Download the Extension: You typically need to download the pre-compiled binaries for your specific PostgreSQL version (e.g., PostgreSQL 15, 16) and architecture. Search for "pgvector pre-compiled binaries for Windows," or [download what we used](https://github.com/andreiramani/pgvector_pgsql_windows/releases/tag/0.8.1_18.0.2)
3. Add `pgvector` files: Copy the necessary files (the .dll and .control files) into the PostgreSQL installation's
4. Restart the PostgreSQL Service: Restart the service after placing the files.
5. After installing the pgvector extensions, run the data migration command in terminal: `node .\server\rag\db\migrate.js`. You should get a console log message that indicates the data migration test was successful.  

#### Setting up the Knowledge Base 
After successfully running the database migration script, you should see the "documents" table in the pgAdmin client. Run `node .\server\rag\db\seed.js` in terminal to feed our pharmacy policy to that same table. This enables our LLM to respond with information related to our pharmacy. 

### 5. Setup & Installation: Local Development Server Startup
6. To start the back-end, open a second terminal window, run `node server\server.js` to start the server.
7. Navigate to [http://localhost:5000/api/test-db](http://localhost:5000/api/test-db) in the browser to test PostgreSQL database connection to Express server

You should now have Astro.js front-end available in the browser, an Express.js server at localhost:5000/api, and a PostgreSQL server active containing our pharmacy policy.
Finally, navigate to [localhost:4321/chat](http://localhost:4321/chat) to chat with the pharmacy bot (and run RAG orchestration behind the scenes).


---

## Description of chatbot key security feature 
- For the prototype, our chatbot functions to answer questions related to the policy of our online pharmacy (as seen in docs/Pharmacy_Policy.txt). The user enters a query, and the chatbot responds if it can answer with its ground truth data. 

- Everything for this chatbot is run locally in your system, so all of your user data should be safe against cyberattacks. We also have a login feature, but it isn't fully implemented yet (you can put whatever you want for the username and password). 
