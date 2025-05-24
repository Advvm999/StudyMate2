from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from src.models.user import User
from src.main import db
from flask_babel import gettext as _

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
        
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            login_user(user)
            next_page = request.args.get('next')
            flash(_('تم تسجيل الدخول بنجاح!'), 'success')
            return redirect(next_page or url_for('main.index'))
        else:
            flash(_('فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.'), 'danger')
    
    return render_template('auth/login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
        
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        specialty = request.form.get('specialty')
        level = request.form.get('level')
        
        user_exists = User.query.filter_by(email=email).first()
        username_exists = User.query.filter_by(username=username).first()
        
        if user_exists:
            flash(_('البريد الإلكتروني مستخدم بالفعل.'), 'danger')
        elif username_exists:
            flash(_('اسم المستخدم مستخدم بالفعل.'), 'danger')
        else:
            hashed_password = generate_password_hash(password)
            new_user = User(username=username, email=email, password=hashed_password, 
                           specialty=specialty, level=level)
            db.session.add(new_user)
            db.session.commit()
            
            flash(_('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.'), 'success')
            return redirect(url_for('auth.login'))
    
    return render_template('auth/register.html')

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash(_('تم تسجيل الخروج بنجاح.'), 'success')
    return redirect(url_for('main.index'))
