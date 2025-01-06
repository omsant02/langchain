// v1-basic/basic-chat.js
import { ChatOpenAI } from "@langchain/openai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the chat model
const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo", // Using 3.5 to keep costs lower while testing
    temperature: 0,
});

// Function to test the chatbot
async function testChat() {
    try {
        // Simple test message
        const messages = [
            { role: "user", content: "Hi! I'm a new user." }
        ];

        console.log("Sending message to chatbot...");
        const response = await llm.invoke(messages);
        
        console.log("\nUser: Hi! I'm a new user.");
        console.log("Assistant:", response.content);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the test
testChat();