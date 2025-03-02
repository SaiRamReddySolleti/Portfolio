import * as fs from 'fs/promises';
import * as path from 'path';

const OPENROUTER_API_KEY = "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";
const YOUR_SITE_URL = "$YOUR_SITE_URL";

class Semaphore {
  private tasks: (() => void)[] = [];
  private counter: number;

  constructor(counter: number) {
    this.counter = counter;
  }

  async acquire() {
    if (this.counter > 0) {
      this.counter--;
      return;
    }
    await new Promise<void>((resolve) => this.tasks.push(resolve));
  }

  release() {
    this.counter++;
    if (this.tasks.length > 0) {
      const nextTask = this.tasks.shift();
      if (nextTask) nextTask();
    }
  }
}

class ClientSession {
  private controller: AbortController;

  constructor() {
    this.controller = new AbortController();
  }

  async post(url: string, options: any) {
    try {
      console.log(`Sending POST request to ${url} with options:`, options);
      const response = await fetch(url, {
        ...options,
        signal: this.controller.signal,
      });

      if (!response.ok) {
        console.error(`Error: Received status code ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Response received from ${url}:`, data);
      return data;
    } catch (error) {
      console.error(`Error during POST request to ${url}:`, error);
      throw error;
    }
  }

  async close() {
    console.log("Closing session and aborting any ongoing requests");
    this.controller.abort();
  }
}

class OpenRouterChatApp {
  private session: any;
  private selectedModel: string;
  private conversationHistory: Array<{ role: string, content: string }>;
  private semaphore: Semaphore;
  private resumeData: any;

  constructor() {
    this.session = null;
    this.selectedModel = "openai/gpt-3.5-turbo";
    this.conversationHistory = [];
    this.semaphore = new Semaphore(10);
    this.resumeData = null;
    this.loadResumeData();
  }

  async loadResumeData() {
    try {
      console.log("Loading resume data from JSON file");
      const filePath = path.resolve(__dirname, '../../../../../src/data/resumeData.json');
      const data = await fs.readFile(filePath, 'utf-8');
      this.resumeData = JSON.parse(data);
      // console.log("Resume data loaded successfully:", this.resumeData);
    } catch (error) {
      console.error("Error loading resume data:", error);
      this.resumeData = null;
    }
  }

  async initSession() {
    this.session = new ClientSession();
  }

  async closeSession() {
    await this.session.close();
  }

  async getChatCompletion(userInput: string) {
    await this.semaphore.acquire();
    try {
      this.addToConversationHistory("user", userInput);
      const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
      const headers = {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": YOUR_SITE_URL,
        "Content-Type": "application/json"
      };
      const context = `
        You are a chatbot representing me on my personal portfolio website. Your responses must be:
        1. Personal - Always speak in first person ("I", "my", "me")
        2. Detailed but concise - Provide meaningful information without being overwhelming
        3. Based strictly on the provided context
        4. Engaging and professional

        Rules:
        - Always respond as if you are me, the portfolio owner
        - When information is not in the context, suggest relevant portfolio sections:
          - For projects: "You can explore more of my projects on the [Projects](/projects) page"
          - For skills: "Check out my [GitHub](https://github.com/SaiRamReddySolleti) for an overview of my technical skills"
          - For experience: "Visit my [LinkedIn](https://www.linkedin.com/in/sai-ram-reddy-solleti-17b881247/) for my complete professional history"
        - Include 2-3 relevant details when discussing skills or experiences
        - Use markdown links to reference portfolio sections or external profiles
        - Keep responses informative but conversational

        Resume Data: ${JSON.stringify(this.resumeData)}
      `;

      const messages = [...this.conversationHistory];
      messages.unshift({ role: "system", content: context });

      const data = {
        model: this.selectedModel,
        messages: messages
      };

      const response = await this.session.post(apiUrl, { headers, json: data });
      if (response.status !== 200) {
        console.error(`Error: Received status code ${response.status}`);
        return "Error: Unable to get response from the API";
      }

      const apiResult = await response.json();
      if (!apiResult || !apiResult.choices || !apiResult.choices.length) {
        console.error("Error: Invalid API response");
        return "Error: Invalid API response";
      }

      return apiResult.choices[0].message.content;
    } finally {
      this.semaphore.release();
    }
  }

  addToConversationHistory(role: string, content: string) {
    this.conversationHistory.push({ role, content });
  }

  async handleRequest(userInput: string) {
    await this.initSession();
    try {
      console.log("Processing...");
      const assistantResponse = await this.getChatCompletion(userInput);
      console.log(`Assistant: ${assistantResponse}\n`);
      return assistantResponse;
    } catch (error) {
      console.error("Error processing request:", error);
      throw error;
    } finally {
      await this.closeSession();
    }
  }
}

export async function POST(req: Request) {
  const app = new OpenRouterChatApp();
  const { userInput } = await req.json();
  const response = await app.handleRequest(userInput);
  return new Response(response, { status: 200 });
}