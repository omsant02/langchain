// v5-advanced/advanced-chat.js
import { ChatOpenAI } from "@langchain/openai";
import { START, END, MessagesAnnotation, StateGraph, MemorySaver } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { SystemMessage, HumanMessage, AIMessage, trimMessages } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';

dotenv.config();

const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0
});

// Create a stricter message trimmer
const trimmer = trimMessages({
    maxTokens: 4,  // Much stricter limit
    strategy: "last",
    tokenCounter: (msgs) => msgs.length,
    includeSystem: true,
    allowPartial: false,
    startOn: "human"
});

const promptTemplate = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are a helpful assistant. If you can't remember something from earlier in the conversation, admit that you don't know."
    ],
    ["placeholder", "{messages}"]
]);

const callModel = async (state) => {
    // Log the message count before trimming
    console.log(`\nMessage count before trimming: ${state.messages.length}`);
    
    // Trim messages
    const trimmedMessages = await trimmer.invoke(state.messages);
    
    // Log the message count after trimming
    console.log(`Message count after trimming: ${trimmedMessages.length}`);
    
    const prompt = await promptTemplate.invoke({
        messages: trimmedMessages
    });
    
    const response = await llm.invoke(prompt);
    return { messages: [response] };
};

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

const app = workflow.compile({ checkpointer: new MemorySaver() });

async function testChat() {
    try {
        const config = { configurable: { thread_id: uuidv4() } };
        
        const testMessages = [
            "Hi! I'm Bob.",
            "I'm from New York.",
            "I work as a teacher.",
            "What's my name?",
            "Where am I from?",
            "What's my job?",
        ];

        for (const message of testMessages) {
            const input = {
                messages: [{ role: "user", content: message }]
            };
            
            console.log("\n=== New Message ===");
            console.log("User:", message);
            const response = await app.invoke(input, config);
            console.log("Assistant:", response.messages[response.messages.length - 1].content);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

console.log("=== Starting Conversation with Strict Message History Management ===");
testChat();