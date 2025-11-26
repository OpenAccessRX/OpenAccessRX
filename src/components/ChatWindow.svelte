<script>
    const username = "Seattle Frog"; //to dynamically render logged in user's name
    let messages = []; //message history (demo only)
    let userInput = ""; //input field binding
    let isLoading = false;

    async function sendMessage() {

        const userMessage = {
            role: "user",
            content: userInput
        }

        messages = [...messages, userMessage] //add to "local" history
        // messages.push({sender: "user", text: input });
        const inputToSend = userInput;
        userInput = "";
        isLoading = true;

        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", //sends cookies (required for login session)
                body: JSON.stringify({ message: inputToSend })
            });

            if(!res.ok) {
                console.error("Chat API error", res.status);
                //not sure about messages line
                return;
            }
            const data = await res.json();
        } catch(err){
            //add better error handling logic
        } finally {
            isLoading = false;
        }
        
        // messages.push({ sender: "bot", text: data.reply })

        // input = "";
    }

    async function resetChat() {
        messages = [];

        try {
            await fetch("http://localhost:5000/api/chat/reset", { 
                method: "POST",
                credentials: "include" 
            });
        } catch(err) {
            //ignore errors?
        }
    }
</script>

<section class="chatterbox">
    <div class="message-display">
        {#each messages as msg}
            <div class="msg-{msg.role}">
                <strong>
                    {msg.role}: 
                </strong>
                    {msg.content}
            </div>
        {/each}

        {#if isLoading}
            <div class="message-assistant">
                <em>Thinking...</em>
            </div>
        {/if}
    </div>

    <form on:submit|preventDefault={sendMessage}>
        <textarea 
            bind:value={userInput}
            placeholder="Hello {username}! Ask me for help..."
            rows="3"
        ></textarea>
    </form>

    <button class="chat-button" disabled={isLoading}>Send</button>
    <button class="chat-button" on:click={resetChat}>Reset</button>
</section>