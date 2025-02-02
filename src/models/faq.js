const mongoose = require('mongoose');
const { translateText } = require('../services/translationService');

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }, // Can store HTML content (from a WYSIWYG editor)
  question_hi: { type: String, default: '' },
  question_bn: { type: String, default: '' },
  answer_hi: { type: String, default: '' },
  answer_bn: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});
 
FAQSchema.methods.getTranslation = function (lang) {
  if (lang === 'hi') {
    return {
      question: this.question_hi || this.question,
      answer: this.answer_hi || this.answer
    };
  } else if (lang === 'bn') {
    return {
      question: this.question_bn || this.question,
      answer: this.answer_bn || this.answer
    };
  }
  return {
    question: this.question,
    answer: this.answer
  };
};

FAQSchema.pre('save', async function (next) {
  try {
    if (!this.question_hi) {
      this.question_hi = await translateText(this.question, 'hi');
    }
    if (!this.question_bn) {
      this.question_bn = await translateText(this.question, 'bn');
    }
    if (!this.answer_hi) {
      this.answer_hi = await translateText(this.answer, 'hi');
    }
    if (!this.answer_bn) {
      this.answer_bn = await translateText(this.answer, 'bn');
    }
    next();
  } catch (error) {
    console.error('Pre-save translation error:', error);
    next(error);
  }
});

const FAQ = mongoose.model('FAQ', FAQSchema);
module.exports = FAQ;