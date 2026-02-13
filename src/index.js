require('dotenv').config();
const moltService = require('./services/moltService');
const { isTechRelated } = require('./utils/filter');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../agent_internal.log');
function logToFile(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(logFile, line);
}

class MoltAgent {
    constructor() {
        this.pollInterval = parseInt(process.env.POLLING_INTERVAL_MS) || 60000;
        this.processedItems = new Set();
        this.feedbackList = [];
        this.intervalId = null;
        this.isStarting = false;
        logToFile('MoltAgent initialized');
    }

    async start() {
        if (this.intervalId || this.isStarting) {
            console.log('Moltbook AI Agent is already running or starting.');
            return;
        }

        console.log('Moltbook AI Agent starting...');
        logToFile('Moltbook AI Agent started');

        this.isStarting = true;
        this.intervalId = setInterval(() => this.run(), this.pollInterval);

        // Initial run in background
        this.run().catch(err => {
            console.error('Initial run failed:', err.message);
        }).finally(() => {
            this.isStarting = false;
        });
    }

    stop() {
        console.log('Stop request received');
        logToFile('Stop request received');

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.isStarting = false;
        console.log('Moltbook AI Agent stopped.');
        logToFile('Moltbook AI Agent stopped');
    }

    async run() {
        console.log('Scanning Moltbook for tech updates...');
        logToFile('Scanning Moltbook for tech updates...');
        try {
            // Check status first
            // const status = await moltService.client.get('/agents/status');

            const posts = await moltService.getGlobalPosts();
            logToFile(`Fetched ${posts.length} posts`);

            for (const post of posts) {
                if (this.processedItems.has(post.id)) continue;

                if (isTechRelated(post.content)) {
                    console.log(`New tech post found: ${post.id}`);
                    logToFile(`New tech post found: ${post.id}`);
                    this.feedbackList.push({
                        type: 'post',
                        id: post.id,
                        content: post.content,
                        timestamp: new Date().toISOString()
                    });

                    // Logic to respond if it's a question (simplified)
                    if (post.content.includes('?')) {
                        await this.respondToQuestion(post.id, post.content);
                    }
                }

                const comments = await moltService.getComments(post.id);
                for (const comment of comments) {
                    if (this.processedItems.has(comment.id)) continue;

                    if (isTechRelated(comment.content)) {
                        console.log(`New tech comment found: ${comment.id}`);
                        logToFile(`New tech comment found: ${comment.id}`);
                        this.feedbackList.push({
                            content: post.content,
                            timestamp: new Date().toISOString()
                        });

                        // Logic to respond if it's a question (simplified)
                        if (post.content.includes('?')) {
                            await this.respondToQuestion(post.id, post.content);
                        }
                    }

                    const comments = await moltService.getComments(post.id);
                    for (const comment of comments) {
                        if (this.processedItems.has(comment.id)) continue;

                        if (isTechRelated(comment.content)) {
                            console.log(`New tech comment found: ${comment.id}`);
                            this.feedbackList.push({
                                type: 'comment',
                                id: comment.id,
                                content: comment.content,
                                timestamp: new Date().toISOString()
                            });

                            if (comment.content.includes('?')) {
                                await this.respondToQuestion(post.id, comment.content, comment.id);
                            }
                        }
                        this.processedItems.add(comment.id);
                    }
                    this.processedItems.add(post.id);
                }
            }
        } catch (error) {
            console.error('Agent execution error:', error.message);
            logToFile(`Agent execution error: ${error.message} ${error.stack}`);
        }
    }

    async respondToQuestion(postId, text, commentId) {
        console.log(`Responding to question: ${text}`);
        const responseContent = "I'm checking the latest industry standards on this. Stay tuned!";
        try {
            if (commentId) {
                // Potentially reply to comment if API supports it, otherwise post on thread
                await moltService.createComment(postId, responseContent);
            } else {
                await moltService.createComment(postId, responseContent);
            }
        } catch (error) {
            console.error('Failed to respond:', error.message);
        }
    }

    getFeedback() {
        return this.feedbackList;
    }
}

if (require.main === module) {
    const agent = new MoltAgent();
    agent.start();
}

module.exports = MoltAgent;
