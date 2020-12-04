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
    type = Column(db.String(50))
    token: str = ''

    __mapper_args__ = {
        'polymorphic_identity': 'user',
        'polymorphic_on': type
    }

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
        return '<User({name!r})>'.format(name=self.name)


parents_children = db.Table('parents_children',
    Column('parent_id', db.Integer, db.ForeignKey('parent.id')),
    Column('child_id', db.Integer, db.ForeignKey('child.id'))
)


class Parent(User):
    __tablename__ = 'parent'
    __table_args__ = {'extend_existing': True}
    __mapper_args__ = {'polymorphic_identity': 'parent'}
    id = Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    children = relationship('Child', secondary=parents_children, back_populates="parents")

    def __init__(self, name, surname, email, password, **kwargs):
        super().__init__(name, surname, email, password, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Parent({name!r})>'.format(name=self.name)


class Child(User):
    __tablename__ = 'child'
    __mapper_args__ = {'polymorphic_identity': 'child'}
    id = Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    parents = relationship('Parent', secondary=parents_children, back_populates="children")
    ehrid = Column(db.String, unique=True)
    timer = Column(db.DateTime, default=None, nullable=True)
    rewards = relationship('Reward', backref='child', lazy=True)

    def __init__(self, name, surname, email, password, parent, ehrid, **kwargs):
        super().__init__(name, surname, email, password, **kwargs)
        self.parents.append(parent)
        self.ehrid = ehrid
    
    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Child({name!r}{parent!r})>'.format(name=self.name, parent=self.parents)


class Reward(SurrogatePK, Model):
    __tablename__= 'reward'
    nameOf = Column(db.String, nullable=False)
    description = Column(db.String, nullable=False)
    reward = Column(db.String, nullable=False)
    endDate = Column(db.DateTime, nullable=False)
    startDate = Column(db.DateTime, nullable=False)
    child_ehrid = Column(db.Integer, db.ForeignKey('child.ehrid'), nullable=False)

    def __init__(self, nameOf, description, reward, endDate, startDate, ehrid, **kwargs):
        db.Model.__init__(self, nameOf=nameOf, description=description, reward=reward, endDate = endDate, startDate = startDate, child_ehrid = ehrid, **kwargs)
        
    
    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Reward({nameOf!r})>'.format(nameOf=self.nameOf)

    
