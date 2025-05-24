from src.main import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    specialty = db.Column(db.String(100), nullable=True)
    level = db.Column(db.String(50), nullable=True)
    language = db.Column(db.String(10), default='ar')
    
    def __repr__(self):
        return f'<User {self.username}>'
