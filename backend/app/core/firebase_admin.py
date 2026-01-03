import firebase_admin
from firebase_admin import credentials
import os

if not firebase_admin._apps:
    cred = credentials.Certificate(
        os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")
    
    )
    firebase_admin.initialize_app(cred)