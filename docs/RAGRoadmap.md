# Roadmap Worksheet for RAG Pipeline (11/21/2025)
1. Backend:
- Express.js v5 (Node v22 + ES modules) 
- Hugging Face Inference API via `@huggingface/inference` (InferenceClient) 
- Postgres + `pgvector` 
- `pg` (node-postgres driver) 
- `pgvector` (Postgres vector extension) 
- Your own custom RAG flow 
- Security-aware architecture 
- `dotenv` for config (accessing the `.env` file) 
- zod (optional but recommended for input validation)(I am not sure about this route but keeping it as a note) 
- `express-rate-limit` (security) 
2. Database: 
- PostgreSQL 
- `pgvector` extension 
- SQL migrations (manual or with a tool like Postgrator) 
3. Frontend: 
- Astro.js (vanilla JavaScript & optional components) 
- Fetch POST -> `/chat` 
- Possibly SSE or WebSocket streaming (I need to look into this but might be out of scope) 

## Using ES modules everywhere
```js
import { something } from "./something.js";
export function somethingElse() {
   return something();
}
```

## RAG Pipeline Dependency Graph
```scss
   ┌────────────┐
   │ Raw Docs    │  (input from teammate C)
   └──────┬──────┘
          │
     (1) Embedding Generation  ←—— can be built independently
          │
          ▼
     (2) Storage Layer (DB)    ←—— needs embedding output shape, but no other dependency
          │
          ▼
     (3) Vector Retrieval       ←—— depends on (2), but not on the LLM at all
          │
          ▼
     (4) Prompt Construction    ←—— depends on (3) only for data shape
          │
          ▼
     (5) LLM Generation         ←—— independent of storage, just needs prompt
          │
          ▼
     (6) RAG Assembly           ←—— final composition of 1–5
```

## "plug-in" RAG strategy
embed()
→ searchDocs()
→ buildPrompt()
→ generate()

The final rag pipeline calls these functions in order:
```js
export async function embedText() {}
export async function insertDoc() {}
export async function searchDocs() {}
export async function buildPrompt() {}
export async function generateAnswer() {}
```
The final RAG assembly function (integration point) might look like this:
```js
async function rag(question) {
  const queryEmbedding = await embedText(question);
  const docs = await searchDocs(queryEmbedding);
  const prompt = buildPrompt(question, docs);
  const answer = await generateAnswer(prompt);
  return { answer, retrievedDocs: docs };
}
```

## Developer Roles

### Developer A — Embeddings Layer
- Implement `embedText(text)` (processes raw user text securely inside our server.)
This function must produce embeddings that Developer B can store in Postgres/pgvector.
- Write tests to embed strings
- Provide output shape & type to DB engineer

#### Technologies
- `@xenova/transformers` (local, CPU-based transformer inference)  
- Node.js v22  
- ES modules  
#### Responsibilities:
- Implement a standalone local embedding function using Xenova.
- Load the embedding model once and reuse it.
- Ensure output type is a Float32Array (or JS array of floats).
- Document the embedding dimension, dtype, and shape for Developer B.
- Create a small test harness that prints sample embeddings. (however you want to interpret this, we only have time for minimal testing)
- Export embedding functions in a clean module.
#### Functions you must create
Create a `llm` directory inside `/server/rag` directory  

Inside: `/server/rag/llm/`
1. create file: `localEmbed.js`
```js
//I did not vet this content because of the last-minute change
import { pipeline } from "@xenova/transformers"; 

// Load model once at startup.
let embedder;

export async function loadEmbeddingModel() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

export async function embedText(text) {
  if (!embedder) await loadEmbeddingModel();

  const output = await embedder(text, { pooling: "mean", normalize: true });
  // output.data is a Float32Array
  return output.data;
}

```
2. create file: `models.js`
```js 
// Embedding model (local)
export const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
//this was a chatgpt5 recommendation, if you prefer a different model go for it
```

--- 

### Developer B — Postgres + Retrieval
Setup tables with pgvector  
Write:  
`insertDoc(content, embedding)`  
`searchDocs(queryEmbedding, k)`  
Test retrieval with fake embeddings (testing is done at your discretion, we don't have time to do 'real' testing)  
Goal: Implement Postgres schema, vector storage, and vector search.  

#### Responsibilities:
- Install & enable pgvector
- Create SQL migrations
- Create a document storage interface
- Implement cosine similarity retrieval
- Convert Float32Array embeddings from Developer A into Postgres vector format

#### Functions you must create
Create a `db` directory inside `/server/rag` directory  

Inside: `/server/rag/db/`
1. create this file: `schema.sql`
```js
//this is just example code I did not vet, feel free to write what you want of course
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(384) -- dimension must match Developer A's local embedding output
);
```
2. create this file: `insertDoc.js`
```js
//This was last minute changes for doing local embedding, so no idea if it is on the right track (placeholder code)
export async function insertDoc([content, vectorLiteral]) {
    const vectorLiteral = `[${Array.from(embedding).join(",")}]`;

// embedding is Float32Array → convert to Postgres vector
}
```
3. create this file: `searchDocs.js`
```js
// same comments as in 1. and 2.
// /server/rag/db/searchDocs.js

import db from "./client.js"; // your pg client wrapper

/**
 * Search the documents table for the k most similar embeddings
 * @param {Float32Array} queryEmbedding - embedding from local model
 * @param {number} k - number of results to return
 * @returns {Array<{id: number, content: string}>} - top k matching documents
 */
export async function searchDocs(queryEmbedding, k = 5) {
  // Convert Float32Array to Postgres vector literal
  const vectorLiteral = `[${Array.from(queryEmbedding).join(",")}]`;

  const result = await db.query(
    `
    SELECT id, content
    FROM documents
    ORDER BY embedding <-> $1  -- cosine distance (assumes normalized embeddings)
    LIMIT $2
    `,
    [vectorLiteral, k]
  );

  return result.rows;
}

```

---

### Developer C — Prompt + LLM
Write:
buildPrompt(question, docs)
generateAnswer(prompt)
Mock docs:
```js
const docs = [{content: "doc 1"}, {content: "doc 2"}];
```

#### Responsibilities:

#### Functions you must create
Create a `pipeline` directory inside `/server/rag` directory  

Inside: `/server/rag/pipeline/` 
1. create this file: `buildPrompt.js`
```js
export function buildPrompt(question, docs) {
  // returns prompt string
}
```
2. create this file: `rag.js`
```js
import { embedText } from "../llm/embedText.js";
import { searchDocs } from "../db/searchDocs.js";
import { buildPrompt } from "./buildPrompt.js";
import { generateAnswer } from "../llm/generateAnswer.js";

export async function rag(question) {
  const qEmbedding = await embedText(question);
  const docs = await searchDocs(qEmbedding, 5);
  const prompt = buildPrompt(question, docs);
  const answer = await generateAnswer(prompt);
  return { answer, docs };
}
```

## Target File Structure for RAG Pipeline
```shell
/server
  /rag
    /llm
      embedText.js
      generateAnswer.js
      models.js
    /db
      schema.sql
      insertDoc.js
      searchDocs.js
    /pipeline
      buildPrompt.js
      rag.js
  server.js (Express)
  routes.js (router) //maybe
  env.js (config) //maybe
/src       
```

## Milestones
### 1. Basic LLM call working ("hello world" call)
Goal: Get a single API call from Express → Hugging Face Inference API → back to client.
- `@huggingface/inference`
- Express.js
- `.env` variables for API key
---> Deliverables:
- `POST /chat` response with LLM output based on a prompt

*status:* text

### 2. Generate embeddings and store them  
Goal: Add document ingestion so you can embed your corpus.  
- -Hugging Face Inference API (Embeddings model, e.g. sentence-transformers or all-MiniLM)- LOCAL
- node-postgres
- pgvector extension
- A local migration to add vector columns
---> Deliverables:
- Route: `POST /docs`: Adds a document → creates embedding → stores in Postgres.
- SQL schema:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(384) -- depends on model dims
);
```

*status:* text → embedding → vector db

### 3. Implement vector search retrieval
Goal: Retrieve semantically relevant documents for a query.
- pgvector + SQL
- Node-postgres
- Express route for retrieval
---> Deliverables:
- embed query text
- perform vector similarity search:
```sql
SELECT id, content, embedding
FROM documents
ORDER BY embedding <-> $1
LIMIT 5;
```
- return top-k docs

*status:* query → embedding → database → top-k docs

### 4. Complete RAG pipeline in Express  
Goal: Assemble the whole chain:  
    user query → embed → vector search → build prompt with context → LLM → answer  
---> Technologies:  
- Your previous Express routes made into one pipeline
- InferenceClient for LLM
- Prompt engineering for RAG
---> Deliverables:  
Route: POST /chat:  
1. Embed the query
2. Retrieve top documents
3. Construct an instruction prompt including retrieved context
4. Call Hugging Face LLM
5. Return the answer

### 5. Security, scaling, streaming output, guardrails
---> Technologies:
- Express rate limiting (express-rate-limit)
- Validation (zod)
- HTTPS, CORS restrictions
- SSE (Server-Sent Events) for streaming from LLM
- Logging (winston/pino)
- Optional: API key auth for your own API
---> Deliverables:
- `/chat` now supports streaming output to Astro
- App sanitized for untrusted user input
- Secure environment variable handling

## Function Contracts
embedText(text) → number[]  
insertDoc(content, embedding) → row  
searchDocs(embedding, k) → docs[]  
buildPrompt(question, docs) → string  
generateAnswer(prompt) → answer  
rag(question) → {answer, docs}  

---

## 🔐 Security Guidelines

- API key never exposed to frontend
- Express rate limits on `/chat`
- Input validation using `zod`(or some other input validation, we are not doing TS so not sure about zod here)
- Sanitization before DB insertion
- Astro only calls your Express proxy (never HF directly)

## Non-Parallel Work

THE NON-PARALLEL 20% (Pipeline Integration)  

Step 1 — Decide the unified embeddings model  
All functions downstream need to know the vector dimension.
Retrieval layer, DB schema, and prompt builder must reference the same model.
Dependency: Embedding function must exist first.

Step 2 — Insert actual embeddings into the database  
DB must store real vectors before retrieval is meaningful.
Retrieval developer needs exact shape and data type.  
Dependency: Embeddings + schema must be finalized.

Step 3 — Test vector search using real embeddings   
Must confirm:  
- correct vector similarity operator (<->)
- dimension matches
- performance is sane  
Dependency: Data ingestion + embeddings.

Step 4 — Build the final RAG pipeline function (rag())  
This is the REAL assembly point:
```js
async function rag(question) {
  const qEmbedding = await embedText(question);       // 1
  const docs = await searchDocs(qEmbedding, 5);        // 2
  const prompt = buildPrompt(question, docs);          // 3
  const answer = await generateAnswer(prompt);         // 4
  return { answer, docs };
}
```
Must be done after all component functions exist.

Step 5 — Write the Express /chat handler  
This is the only point where:
- request validation
- rate limiting
- security
- pipeline invocation
come together.  
Dependency: RAG function must exist.

Step 6 — Integration testing  
Testing the pipeline end-to-end with:
- sample docs
- sample queries
- failure cases
- rate limits
- long docs
- empty result sets  
Dependency: Entire pipeline assembled.


### 📌 Summary of What Must Be Sequential
| Step | Description                    | Depends on |
| ---- | ------------------------------ | ---------- |
| 1    | Confirm embedding model choice | none       |
| 2    | Insert real doc embeddings     | 1          |
| 3    | Real retrieval tests           | 2          |
| 4    | Assemble RAG pipeline          | 1,2,3      |
| 5    | Implement `/chat` route        | 4          |
| 6    | Full RAG testing               | 5          |
