// v4-multilingual/multilingual-chat.js
import { 
    START,
    END,
    StateGraph,
    MemorySaver,
    MessagesAnnotation,
    Annotation,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';

dotenv.config();

const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0
});

const promptTemplate2 = ChatPromptTemplate.fromMessages([
    [
        "system",
        "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
    ],
    ["placeholder", "{messages}"],
]);

// Define the State exactly as in docs
const GraphAnnotation = Annotation.Root({
    ...MessagesAnnotation.spec,
    language: Annotation<string>(),
});

// Define the function that calls the model
const callModel3 = async (state) => {
    const prompt = await promptTemplate2.invoke(state);
    const response = await llm.invoke(prompt);
    return { messages: [response] };
};

// Create workflow exactly as shown in docs
const workflow3 = new StateGraph(GraphAnnotation)
    .addNode("model", callModel3)
    .addEdge(START, "model")
    .addEdge("model", END);

const app3 = workflow3.compile({ checkpointer: new MemorySaver() });

async function testChat() {
    try {
        const config4 = { configurable: { thread_id: uuidv4() } };
        const input6 = {
            messages: [
                {
                    role: "user",
                    content: "Hi im bob",
                },
            ],
            language: "Spanish",
        };
        
        const output7 = await app3.invoke(input6, config4);
        console.log("\nUser: Hi im bob");
        console.log("Assistant:", output7.messages[output7.messages.length - 1].content);

        // Follow-up message
        const input7 = {
            messages: [
                {
                    role: "user",
                    content: "What is my name?",
                },
            ],
        };
        
        const output8 = await app3.invoke(input7, config4);
        console.log("\nUser: What is my name?");
        console.log("Assistant:", output8.messages[output8.messages.length - 1].content);

    } catch (error) {
        console.error("Error:", error);
    }
}

testChat();