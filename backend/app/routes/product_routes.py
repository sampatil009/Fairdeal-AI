from flask import Blueprint, request, jsonify
from bson import json_util
import json

product_bp = Blueprint('products', __name__)

def parse_json(data):
    return json.loads(json_util.dumps(data))

@product_bp.route('/', methods=['GET'])
def get_products():
    from app import db
    
    query = {}
    
    category = request.args.get('category')
    search = request.args.get('search')
    negotiation_enabled = request.args.get('negotiationEnabled')
    min_price = request.args.get('minPrice')
    max_price = request.args.get('maxPrice')

    if category and category != 'All':
        query['category'] = category
        
    if search:
        query['name'] = {'$regex': search, '$options': 'i'}
        
    if negotiation_enabled is not None:
        query['negotiationEnabled'] = negotiation_enabled.lower() == 'true'
        
    if min_price or max_price:
        query['price'] = {}
        if min_price:
            query['price']['$gte'] = float(min_price)
        if max_price:
            query['price']['$lte'] = float(max_price)

    products_cursor = db.products.find(query)
    products = list(products_cursor)
    
    # Format for frontend
    for p in products:
        p['_id'] = str(p['_id'])
        if 'id' not in p:
            p['id'] = p['_id']

    return jsonify({"products": parse_json(products)}), 200

@product_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    from app import db
    
    product = db.products.find_one({"id": product_id})
    if not product:
        # Fallback to _id if needed, though we use custom string IDs
        from bson.objectid import ObjectId
        from bson.errors import InvalidId
        try:
            product = db.products.find_one({"_id": ObjectId(product_id)})
        except InvalidId:
            pass
            
    if not product:
        return jsonify({"error": "Product not found"}), 404
        
    product['_id'] = str(product['_id'])

    return jsonify({"product": parse_json(product)}), 200
