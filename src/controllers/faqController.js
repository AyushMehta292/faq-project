const FAQ = require('../models/faq');

const getFaqs = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const faqs = await FAQ.find().sort({ created_at: -1 });
    const result = faqs.map(faq => {
      const translation = faq.getTranslation(lang);
      return {
        id: faq._id,
        question: translation.question,
        answer: translation.answer,
        created_at: faq.created_at
      };
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required.' });
    }
    const faq = new FAQ({ question, answer });
    await faq.save();
    res.status(201).json({
      id: faq._id,
      question: faq.question,
      answer: faq.answer,
      created_at: faq.created_at
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getFaqs,
  createFaq
};