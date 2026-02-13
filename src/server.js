const express = require('express');
const path = require('path');
const fs = require('fs');
const MoltAgent = require('./index');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

// Initialize the agent (but don't start polling yet)
const agent = new MoltAgent();

// Every time the agent runs, it should save feedback to public/feedback.json
const originalRun = agent.run.bind(agent);
agent.run = async () => {
    await originalRun();
    fs.writeFileSync(
        path.join(__dirname, '../public/feedback.json'),
        JSON.stringify(agent.getFeedback(), null, 2)
    );
};

app.get('/api/feedback', (req, res) => {
    res.json(agent.getFeedback());
});

app.post('/api/start', (req, res) => {
    agent.start(); // Non-blocking
    res.json({ status: 'starting' });
});

app.post('/api/stop', (req, res) => {
    agent.stop();
    res.json({ status: 'stopped' });
});

app.get('/api/status', (req, res) => {
    res.json({
        running: !!agent.intervalId,
        starting: agent.isStarting
    });
});

app.listen(port, () => {
    console.log(`Feedback interface running at http://localhost:${port}`);
});
