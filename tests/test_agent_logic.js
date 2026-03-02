const MoltAgent = require('../src/index');
const moltService = require('../src/services/moltService');
const assert = require('assert');

// Mock moltService
moltService.getGlobalPosts = async () => [
    { id: 'post1', content: 'AI post with question?' },
    { id: 'post2', content: 'Non-matching post' }
];

moltService.getComments = async (postId) => {
    if (postId === 'post1') {
        return [
            { id: 'comment1', content: 'technology comment?' },
            { id: 'comment2', content: 'Non-matching comment' }
        ];
    }
    return [];
};

moltService.createComment = async (postId, content) => {
    console.log(`Mock: Created comment on ${postId}: ${content}`);
};

async function testAgent() {
    console.log('Starting MoltAgent logic test...');
    const agent = new MoltAgent();

    // Set a very long interval to avoid actual polling during test
    agent.pollInterval = 1000000;

    await agent.run();

    const feedback = agent.getFeedback();
    console.log('Feedback generated:', JSON.stringify(feedback, null, 2));

    // Assertions
    assert.strictEqual(feedback.length, 2, 'Should have 2 feedback items (1 post, 1 comment)');
    assert.strictEqual(feedback[0].type, 'post', 'First item should be a post');
    assert.strictEqual(feedback[0].id, 'post1', 'First item should be post1');
    assert.strictEqual(feedback[1].type, 'comment', 'Second item should be a comment');
    assert.strictEqual(feedback[1].id, 'comment1', 'Second item should be comment1');
    assert.strictEqual(feedback[1].content, 'technology comment?', 'Second item content should be correct');

    // Run again to verify processedItems Set works
    console.log('Running again to verify deduplication...');
    await agent.run();
    assert.strictEqual(agent.getFeedback().length, 2, 'Feedback length should still be 2 after second run due to deduplication');

    console.log('Test PASSED!');
}

testAgent().catch(err => {
    console.error('Test FAILED:', err);
    process.exit(1);
});
