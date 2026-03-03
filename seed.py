import sys
import os
from pymongo import MongoClient

def seed():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["fairdeal"]

    # Clear old data
    db.products.delete_many({})
    db.users.delete_many({})
    
    products = [
        {
            "id": "prod_1",
            "name": "Sony WH-1000XM5 Wireless Headphones",
            "description": "Industry leading noise canceling with two processors control 8 microphones for unprecedented noise cancellation.",
            "price": 29990,
            "minPrice": 24500,
            "category": "Electronics",
            "images": ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            "rating": 4.8,
            "reviewCount": 12453,
            "stock": 42,
            "negotiationEnabled": True,
            "featured": True
        },
        {
            "id": "prod_2",
            "name": "Apple MacBook Pro M3 (14-inch)",
            "description": "The 14-inch MacBook Pro blasts forward with M3, an incredibly advanced chip that brings serious speed and capability.",
            "price": 169900,
            "minPrice": 152000,
            "category": "Laptops",
            "images": ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            "rating": 4.9,
            "reviewCount": 8342,
            "stock": 15,
            "negotiationEnabled": True,
            "featured": True
        }
    ]
    
    db.products.insert_many(products)
    print("[SUCCESS] Seeded products to MongoDB")

if __name__ == "__main__":
    seed()
