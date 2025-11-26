import { test, expect } from "@playwright/test";

test("user can login and send a chat message", async ({page}) => {
    //1. navigate to Astro front end:
    await page.goto("http://localhost:4321/loginPage");
    //2. fill out login form
    await page.fill('input[name="username"]', "testuser");
    await page.fill('input[name="password"]', "testpass");
    await page.click('button[type="submit"]');
    //3. wait for redirect/load
    await page.waitForURL('**/chat');
    //4. type a message into your Svelte chat interface:
    await page.fill('textarea', 'Hello AI!');
    await page.click('button:has-text("send")');
    //5. wait for the assistant's reply to appear in DOM
    const reply = await page.waitForSelector(".msg-assistant");
    const text = await reply.textContent();
    console.log("AI replied: ", text);
    expect(text.length).toBeGreaterThan(1); //just verify it's not empty
})