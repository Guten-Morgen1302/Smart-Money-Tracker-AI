import { z } from 'zod';
import OpenAI from 'openai';
import { storage } from './storage';

// OpenServ SDK Agent implementation
class Agent {
  private systemPrompt: string;
  private capabilities: any[] = [];
  private openai: OpenAI | null = null;
  private openservApiKey: string | undefined;

  constructor({ systemPrompt }: { systemPrompt: string }) {
    this.systemPrompt = systemPrompt;
    this.openservApiKey = process.env.OPENSERV_API_KEY;

    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }

    if (!this.openservApiKey) {
      console.warn('OpenServ API key not found. Some agent capabilities may be limited.');
    }
  }

  addCapability({ name, description, schema, run }: any) {
    this.capabilities.push({
      name,
      description,
      schema,
      run
    });
    return this;
  }

  async process({ messages }: { messages: any[] }) {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.');
    }

    try {
      const userMessage = messages.find(m => m.role === 'user')?.content || '';

      if (this.openservApiKey) {
        try {
          for (const capability of this.capabilities) {
            if (this.shouldUseCapability(userMessage, capability)) {
              const args = this.extractArgs(userMessage, capability);
              const result = await capability.run({ args });

              return {
                choices: [
                  {
                    message: {
                      role: 'assistant',
                      content: result
                    }
                  }
                ]
              };
            }
          }
        } catch (error: any) {
          console.error('OpenServ SDK error:', error);
        }
      }

      for (const capability of this.capabilities) {
        if (this.shouldUseCapability(userMessage, capability)) {
          try {
            const args = this.extractArgs(userMessage, capability);
            const result = await capability.run({ args });

            return {
              choices: [
                {
                  message: {
                    role: 'assistant',
                    content: result
                  }
                }
              ]
            };
          } catch (error: any) {
            return {
              choices: [
                {
                  message: {
                    role: 'assistant',
                    content: `Error processing request: ${error.message}`
                  }
                }
              ]
            };
          }
        }
      }

      if (this.openai) {
        try {
          const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: this.systemPrompt },
              ...messages
            ]
          });

          return {
            choices: response.choices
          };
        } catch (error: any) {
          if (error?.error?.type === 'insufficient_quota') {
            return {
              choices: [{
                message: {
                  role: 'assistant',
                  content: "I can help you with:\n- Market trends\n- Wallet information\n- Transaction history\n- AI insights\n\nPlease ask about one of these topics!"
                }
              }]
            };
          }
          throw error;
        }
      }

      return {
        choices: [
          {
            message: {
              role: 'assistant',
              content: "I'm not sure how to help with that specific request. You can ask me about cryptocurrency market trends, wallet information, or transactions."
            }
          }
        ]
      };
    } catch (error: any) {
      console.error("Error processing agent request:", error);

      if (error?.status === 429) {
        return {
          choices: [
            {
              message: {
                role: 'assistant',
                content: `I'm currently experiencing high traffic. In the meantime, I can help you with:\n- Market trends\n- Wallet information\n- Transaction history\n- AI insights\n\nPlease try one of these topics!`
              }
            }
          ]
        };
      }

      return {
        choices: [
          {
            message: {
              role: 'assistant',
              content: `I'm having trouble accessing some of my capabilities right now. You can still ask me about market trends, wallet information, or view recent transactions.`
            }
          }
        ]
      };
    }
  }

  private shouldUseCapability(userMessage: string, capability: any): boolean {
    const message = userMessage.toLowerCase();
    switch (capability.name) {
      case 'getMarketTrends':
        return message.includes('market') || message.includes('trend') || message.includes('price');
      case 'getWalletInfo':
        return message.includes('wallet') || message.includes('address') || message.includes('balance');
      case 'getTransactionInfo':
        return message.includes('transaction') || message.includes('transfer') || message.includes('sent') || message.includes('received');
      case 'getAIInsights':
        return message.includes('insight') || message.includes('predict') || message.includes('analysis') || message.includes('ai');
      default:
        return false;
    }
  }

  private extractArgs(userMessage: string, capability: any): any {
    const message = userMessage.toLowerCase();

    switch (capability.name) {
      case 'getWalletInfo': {
        const addressMatch = userMessage.match(/0x[a-fA-F0-9]+/);
        return { address: addressMatch ? addressMatch[0] : null };
      }
      case 'getTransactionInfo': {
        const isRecent = message.includes('recent') || message.includes('latest');
        const limit = isRecent ? 5 : 10;
        return { limit };
      }
      case 'getAIInsights': {
        const insights = {
          price: message.includes('price'),
          whale: message.includes('whale'),
          market: message.includes('market'),
          trend: message.includes('trend')
        };
        return { insights };
      }
      default:
        return {};
    }
  }

  async handleRequest(req: any, res: any) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const result = await this.process({ messages: [{ role: 'user', content: query }] });
      return res.status(200).json(result);
    } catch (err) {
      console.error('Error processing request', err);
      return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  }
}

// Create the crypto market intelligence agent
export const cryptoAgent = new Agent({
  systemPrompt: 'You are an AI assistant for Smart Money Tracker, a cyberpunk-themed platform for monitoring cryptocurrency market trends, whale transactions, and wallet insights. Provide detailed, accurate information about crypto markets, wallets, and transactions.'
});

// Vercel expects an exported handler function
export default async (req: any, res: any) => {
  await cryptoAgent.handleRequest(req, res);
};
