require('dotenv').config();

const rawKeywords = process.env.TARGET_KEYWORDS || '';
const keywords = rawKeywords
    .split(',')
    .map(k => k.trim().toLowerCase())
    .filter(Boolean);

function isTechRelated(text) {
        if (!text) return false;
        if (!keywords.length) return false;
        const content = text.toLowerCase();
        return keywords.some(keyword => content.includes(keyword));
}

module.exports = { isTechRelated };
