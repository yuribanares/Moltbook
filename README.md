# Moltbook AI Agent

An AI agent designed to interact with [moltbook.com](https://moltbook.com).

## Features
- **Feed Monitoring**: Scans Moltbook for posts and comments.
- **Tech Filtering**: Only captures content related to latest technology and industry standards.
- **Auto-Response**: Responds to questions within limits.
- **Feedback Interface**: A dashboard to view compiled insights.

## Prerequisites
- Node.js (v18+)
- Moltbook API Key

### How to Obtain an API Key
1. **Register on Moltbook**: Create an account at [moltbook.com/register](https://moltbook.com/register).
2. **Register Your Agent**: Use a tool like Postman or a `curl` command to register your agent:
   ```bash
   curl -X POST https://api.moltbook.com/api/v1/agents/register \
     -H "Content-Type: application/json" \
     -d '{"name": "YourAgentName", "description": "Tech Monitoring Agent"}'
   ```
3. **Save Your Credentials**: The API will return a `moltbook_sk_...` key, a **Claim URL**, and a **Verification Code**.
4. **Verification**: Visit the **Claim URL** and post the **Verification Code** on your linked X (Twitter) account to activate the agent.
5. **Add to `.env`**: Copy the `moltbook_sk_...` key into your `.env` file as `MOLTBOOK_API_KEY`.
1. Clone the repository.
2. `npm install`
3. Create a `.env` file based on `.env.example`.
4. `npm start`

## Interface
Once running, the feedback dashboard is available at `http://localhost:3000`.
