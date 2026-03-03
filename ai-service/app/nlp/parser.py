import spacy
import re

# In production, load a real spacy model: nlp = spacy.load("en_core_web_sm")
# Mocking for immediate run without requiring user to python -m spacy download en_core_web_sm
class DummyNLP:
    def __call__(self, text):
        return text

nlp = DummyNLP()

def extract_price_and_intent(text):
    """
    Extracts numerical price from text and guesses intent.
    Returns: (float_offer, string_intent)
    """
    if isinstance(text, (int, float)):
        return text, 'offer'
        
    text = str(text).lower()
    
    # 1. Price Extraction
    # Match $100, 100$, 100.50, etc.
    price_match = re.search(r'\$?(\d+(\.\d{1,2})?)\$?', text)
    offer = None
    if price_match:
        offer = float(price_match.group(1))

    # 2. Intent Detection
    intent = 'offer'
    if 'deal' in text or 'accept' in text or 'ok' in text or 'yes' in text:
        intent = 'accept'
    elif 'no' in text or 'reject' in text or 'terrible' in text:
        intent = 'reject'
    elif 'why' in text or 'how' in text or '?' in text:
        intent = 'question'

    return offer, intent
