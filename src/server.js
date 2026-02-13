const express = require('express');
const path = require('path');
const fs = require('fs');
const MoltAgent = require('./index');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

// Start the agent
const agent = new MoltAgent();
agent.start();

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

app.listen(port, () => {
    console.log(`Feedback interface running at http://localhost:${port}`);
});
