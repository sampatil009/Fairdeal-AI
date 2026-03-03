def generate_explanation(action, offer, context, sentiment):
    """
    Mocking SHAP explanations which usually extract feature importance points.
    """
    tier = context.get("userTier", "Bronze")
    round_num = context.get("currentRound", 1)
    
    explanation = []
    
    if tier in ["Gold", "Platinum"]:
        explanation.append(f"High-value user tier ({tier}) increased max discount allowance.")
    else:
        explanation.append(f"Standard user tier ({tier}) applied strict margin rules.")
        
    if round_num >= 4:
        explanation.append(f"Late negotiation stage (Round {round_num}) pushed for deal closure.")
    else:
        explanation.append(f"Early negotiation (Round {round_num}) favored conservative counter-offers.")
        
    if sentiment > 0.4:
        explanation.append("Positive sentiment slightly improved the counter-offer.")
    elif sentiment < -0.3:
        explanation.append("Negative sentiment detected; maintained harder floor price.")
        
    if action == "accept":
        explanation.append("Offer hit the acceptable profit margin threshold.")
    
    return explanation
