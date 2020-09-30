# -*- coding: utf-8 -*-
"""User models."""
import datetime as dt

from src.database import Column, Model, SurrogatePK, db, reference_col, relationship
from src.extensions import bcrypt


class User(SurrogatePK, Model):
    __tablename__ = 'user'
    name = Column(db.String(80), nullable=False)
    surname = Column(db.String(80), nullable=False)
    email = Column(db.String(100), unique=True, nullable=False)
    password = Column(db.Binary(128), nullable=True)
    created_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    last_seen = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    token: str = ''

    def __init__(self, name, surname, email, password, **kwargs):
        """Create instance."""
        db.Model.__init__(self, name=name, surname=surname, email=email, **kwargs)
        if password:
            self.set_password(password)
        else:
            self.password = None

    def set_password(self, password):
        """Set password."""
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, value):
        """Check password."""
        return bcrypt.check_password_hash(self.password, value)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<User({username!r})>'.format(username=self.username)


class Parent(Model):
    __tablename__ = 'parent'
    __mapper_args__ = {'polymorphic_identity': 'user'}
    id = Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    children = relationship('Child', backref='parent')


    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Parent({username!r})>'.format(username=self.username)


class Child(Model):
    __tablename__ = 'child'
    __mapper_args__ = {'polymorphic_identity': 'user'}
    id = Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    parent_id = reference_col('parent')
    caregiver_id = reference_col('caregiver')
    
    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Child({username!r})>'.format(username=self.username)


class CareGiver(Model):
    __tablename__ = 'caregiver'
    __mapper_args__ = {'polymorphic_identity': 'user'}
    id = Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    patients = relationship('Child', backref='caregiver')

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<CareGiver({username!r})>'.format(username=self.username)