import torch
import torch.nn as nn
import numpy as np

# A minimal DQN architecture matching requirement
class DealDQN(nn.Module):
    def __init__(self, state_dim=6, action_dim=5):
        super(DealDQN, self).__init__()
        self.fc1 = nn.Linear(state_dim, 32)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(32, action_dim)

    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        return self.fc2(out)

# Instantiate the mock model (in production, we'd load trained weights)
model = DealDQN()
model.eval()

def encode_tier(tier):
    mapping = {"Bronze": 0.0, "Silver": 0.33, "Gold": 0.66, "Platinum": 1.0}
    return mapping.get(tier, 0.0)

def compute_state_vector(offer, context, sentiment):
    """
    State Vector:
    1. Normalized price difference
    2. User tier encoded
    3. Inventory pressure (mocked)
    4. Demand index (mocked)
    5. Round number
    6. Sentiment score
    """
    original_price = context.get("originalPrice", 100)
    min_price = context.get("minPrice", 80)
    tier = context.get("userTier", "Bronze")
    round_num = context.get("currentRound", 1)
    
    # 1. Price diff
    if offer is None: offer = original_price
    price_diff = (original_price - offer) / original_price
    price_diff = max(0.0, min(1.0, price_diff))
    
    # 2. Tier
    tier_val = encode_tier(tier)
    
    # 3. Mocks
    inv_pressure = 0.8 # High inventory
    demand = 0.5 # Avg demand
    
    # 5. Round norm
    norm_round = round_num / 5.0
    
    return np.array([price_diff, tier_val, inv_pressure, demand, norm_round, sentiment], dtype=np.float32)


def get_rl_action(offer, context, sentiment):
    """
    Action Space:
    0: Accept
    1: Counter high
    2: Counter medium
    3: Counter low
    4: Add incentive
    """
    state = compute_state_vector(offer, context, sentiment)
    state_t = torch.FloatTensor(state).unsqueeze(0)
    
    with torch.no_grad():
        q_values = model(state_t)
        action_idx = torch.argmax(q_values).item()
        
    # Calculate confidence off softmax
    probs = torch.softmax(q_values, dim=1).numpy()[0]
    confidence = float(np.max(probs))
    
    # Translate action to counter offer
    original_price = context.get("originalPrice", 100)
    min_price = context.get("minPrice", 80)
    round_num = context.get("currentRound", 1)
    
    if offer and offer >= original_price:
        return "accept", offer, 1.0
        
    if offer and offer < min_price and round_num == 5:
        # Hard lock bottom
        return "counter", min_price, confidence
        
    action_str = "counter"
    counter_offer = original_price
    
    # Simple simulated behavior mapping RL to logic
    range_diff = original_price - min_price
    if action_idx == 0 and offer and offer >= min_price:
        action_str = "accept"
        counter_offer = offer
    elif action_idx == 1: # High
        counter_offer = original_price - (range_diff * 0.2)
    elif action_idx == 2: # Medium
        counter_offer = original_price - (range_diff * 0.5)
    elif action_idx == 3: # Low
        counter_offer = original_price - (range_diff * 0.8)
    elif action_idx == 4: # Add incentive / min price 
        counter_offer = min_price
        
    # Ensure monotonic drop
    if offer and counter_offer <= offer:
        action_str = "accept"
        counter_offer = offer
        
    return action_str, int(counter_offer), float(confidence)
