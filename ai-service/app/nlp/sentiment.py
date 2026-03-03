from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def analyze_sentiment(text):
    """
    Returns a compound sentiment score between -1.0 (most negative) and +1.0 (most positive).
    """
    if not isinstance(text, str):
        text = str(text)
        
    vs = analyzer.polarity_scores(text)
    return vs['compound']
