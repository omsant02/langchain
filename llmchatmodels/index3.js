import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';
dotenv.config();

const model = new ChatOpenAI({ model: "gpt-4" });

const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];

// const stream = await model.stream(messages);

// console.log("Streaming translation:");
// for await (const chunk of stream) {
//   process.stdout.write(`${chunk.content}|`);
// }

const stream = await model.stream(messages);

const chunks = [];
for await (const chunk of stream) {
  chunks.push(chunk);
  console.log(`${chunk.content}|`);
}

console.log("\nStream completed");