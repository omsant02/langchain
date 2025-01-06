// v2-memory/memory-chat.js
import { ChatOpenAI } from "@langchain/openai";
import { START, END, MessagesAnnotation, StateGraph, MemorySaver } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the chat model
const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0
});

// Define the function that calls the model
const callModel = async (state) => {
    const response = await llm.invoke(state.messages);
    return { messages: response };
};

// Define the graph
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

// Add memory and compile
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

// Test function
async function testMemoryChat() {
    try {
        // Create a unique conversation ID
        const config = { configurable: { thread_id: uuidv4() } };

        // First message
        console.log("\n=== Starting Conversation ===");
        const input1 = {
            messages: [{ role: "user", content: "Hi! My name is Alice." }]
        };
        const response1 = await app.invoke(input1, config);
        console.log("User: Hi! My name is Alice.");
        console.log("Assistant:", response1.messages[response1.messages.length - 1].content);

        // Second message - testing memory
        console.log("\n=== Continuing Conversation ===");
        const input2 = {
            messages: [{ role: "user", content: "What's my name?" }]
        };
        const response2 = await app.invoke(input2, config);
        console.log("User: What's my name?");
        console.log("Assistant:", response2.messages[response2.messages.length - 1].content);

        // Third message - new conversation with different thread
        console.log("\n=== Starting New Conversation ===");
        const newConfig = { configurable: { thread_id: uuidv4() } };
        const input3 = {
            messages: [{ role: "user", content: "What's my name?" }]
        };
        const response3 = await app.invoke(input3, newConfig);
        console.log("User: What's my name?");
        console.log("Assistant:", response3.messages[response3.messages.length - 1].content);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the test
testMemoryChat();