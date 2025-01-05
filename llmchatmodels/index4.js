import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';
dotenv.config();

const model = new ChatOpenAI({ model: "gpt-4" });

// Create prompt template
const systemTemplate = "Translate the following from English into {language}";
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);

// Format the prompt
const promptValue = await promptTemplate.invoke({
  language: "italian",
  text: "Hello, how are you?",
});

// Get response
const response = await model.invoke(promptValue);
console.log(`Translation: ${response.content}`);

// If you want to see the messages structure:
console.log("\nPrompt messages structure:", promptValue.toChatMessages());