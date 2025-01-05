import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';
dotenv.config();

const model = new ChatOpenAI({ model: "gpt-4" });

// Method 1: String input
const response1 = await model.invoke("Hello");
console.log("String input:", response1.content);

// Method 2: OpenAI format
const response2 = await model.invoke([{ role: "user", content: "Hello" }]);
console.log("OpenAI format:", response2.content);

// Method 3: HumanMessage format
const response3 = await model.invoke([new HumanMessage("Hello")]);
console.log("HumanMessage format:", response3.content);