// v3-personality/personality-chat.js
import { ChatOpenAI } from "@langchain/openai";
import { START, END, MessagesAnnotation, StateGraph, MemorySaver } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the chat model
const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0
});

// Create prompt template
const promptTemplate = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You talk like a pirate. Answer all questions to the best of your ability.",
    ],
    ["placeholder", "{messages}"],
]);

// Define the function that calls the model
const callModel = async (state) => {
    const prompt = await promptTemplate.invoke(state);
    const response = await llm.invoke(prompt);
    // Update message history with response:
    return { messages: [response] };
};

// Define the graph
const workflow = new StateGraph(MessagesAnnotation)
    // Define the (single) node in the graph
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

// Add memory
const app = workflow.compile({ checkpointer: new MemorySaver() });

// Test function
async function testPersonalityChat() {
    try {
        // Create a unique conversation ID
        const config = { configurable: { thread_id: uuidv4() } };

        // First message
        const input1 = {
            messages: [{ role: "user", content: "Hi! What's your favorite type of weather?" }]
        };
        
        const response1 = await app.invoke(input1, config);
        console.log("\nUser: Hi! What's your favorite type of weather?");
        console.log("Pirate:", response1.messages[response1.messages.length - 1].content);

        // Second message
        const input2 = {
            messages: [{ role: "user", content: "Why do you like that weather?" }]
        };
        
        const response2 = await app.invoke(input2, config);
        console.log("\nUser: Why do you like that weather?");
        console.log("Pirate:", response2.messages[response2.messages.length - 1].content);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the test
testPersonalityChat();