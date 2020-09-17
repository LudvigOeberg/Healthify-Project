# -*- coding: utf-8 -*-
"""Todo models."""
import datetime as dt

from src.database import Column, Model, SurrogatePK, db


class Todo(SurrogatePK, Model):

    __tablename__ = 'todos'
    name = Column(db.String(80), unique=True, nullable=False)
    desc = Column(db.String(100), unique=True, nullable=False)
    created_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    updated_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)

    def __init__(self, **kwargs):
        """Create instance."""
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Task({name!r})>'.format(name=self.name)
