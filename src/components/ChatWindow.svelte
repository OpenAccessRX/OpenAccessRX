<script>
    const username = "Seattle Frog"; //to dynamically render logged in user's name
    let messages = [];
    let input = "";

    async function sendMessage() {
        messages.push({sender: "user", text: input });

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input })
        })
        
        const data = await res.json();
        messages.push({ sender: "bot", text: data.reply })

        input = "";
    }

    async function resetChat() {
        await fetch("/api/chat/reset", { method: "POST" });
        messages = [];
    }
</script>

<section class="chatterbox">
    <div id="message-display" class="messages">
        {#each messages as msg}
            <div>{msg.sender}: {msg.text}</div>
        {/each}
    </div>
    <input type="text" id="chat-window" name="" required size="50">
    <button class="chat-button" on:click={sendMessage}>Send</button>
    <button class="chat-button" on:click={resetChat}>Reset</button>
</section>