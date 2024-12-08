import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_CHAT_AI_API_KEY || "", 
  dangerouslyAllowBrowser: true
});

export default openai;
