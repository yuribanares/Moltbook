require('dotenv').config();

const keywords = process.env.TARGET_KEYWORDS.split(',').map(k => k.trim().toLowerCase());

function isTechRelated(text) {
    if (!text) return false;
    const content = text.toLowerCase();
    return keywords.some(keyword => content.includes(keyword));
}

module.exports = { isTechRelated };
