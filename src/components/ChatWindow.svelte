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
        console.log("Current messages in temp storage: ", messages);
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

            messages = [...messages, { role: "assistant", content: data.reply }];

        } catch(err){
            //add better error handling logic
            console.error("Chat send error: ", err)
        } finally {
            isLoading = false;
        }
        
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
            class="chatbox-textarea"
        ></textarea>
        <button class="chat-button" disabled={isLoading}>send</button>
    </form>
    
    <button class="chat-button" on:click={resetChat}>reset</button>
</section>