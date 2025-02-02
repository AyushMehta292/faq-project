const { createClient } = require('redis');
const translate = require('@vitalets/google-translate-api');
require('dotenv').config();


// Initialize Redis client
const redisUrl = `${process.env.REDIS_URL}`;
console.log('Redis URL:', redisUrl);
const redisClient = createClient({ url: redisUrl });
redisClient.connect().catch(console.error);

async function translateText(text, destLang) {
  if (!text) return text;
  const cacheKey = `translation:${text}:${destLang}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return cached;
    }
    // Translate using google-translate-api
    const result = await translate(text, { to: destLang });
    const translatedText = result.text || text;
    // Cache for 24 hours (86400 seconds)
    await redisClient.set(cacheKey, translatedText, { EX: 86400 });
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to original text
    return text;
  }
}

module.exports = {
  translateText
};