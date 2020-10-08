# -*- coding: utf-8 -*-
"""User views."""
import datetime as dt

from flask import request
from flask_apispec import use_kwargs, marshal_with, MethodResource
from flask_apispec.annotations import doc
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, current_user
from sqlalchemy.exc import IntegrityError
from src.database import db

from src.extensions import api
from src.exceptions import InvalidUsage
from .models import User, Parent, Child
from .schema import user_schema, user_schemas, login_schema, register_user_schema, child_schemas, child_schema, parent_schemas


@api.resource('/user')
@marshal_with(user_schema)
@doc(tags=["Accounts"])
class AccountResource(MethodResource):
    @jwt_required
    @doc(description="Get current user")
    def get(self):
        user = current_user
        user.token = request.headers.environ['HTTP_AUTHORIZATION'].split('Token ')[1]
        return current_user
    
    @jwt_required
    @use_kwargs(user_schema)
    @doc(description="Update current user")
    def put(self, **kwargs):
        user = current_user
        user.update(last_seen=dt.datetime.utcnow())
        user.update(**kwargs)
        return user

    @jwt_optional
    @use_kwargs(login_schema)
    @doc(description="Login user")
    def post(self, email, password, **kwargs):
        user = User.query.filter_by(email=email).first()
        if user is not None and user.check_password(password):
            user.token = create_access_token(identity=user, fresh=True)
            user.update(last_seen=dt.datetime.utcnow())
            return user
        else:
            raise InvalidUsage.user_not_found()
    

@api.resource('/users')
@doc(tags=["Accounts"])
class AccountListResource(MethodResource):
    @marshal_with(user_schemas)
    @doc(description="Get all users")
    def get(self):
        users = User.query.all()
        return users

    @use_kwargs(register_user_schema)
    @marshal_with(register_user_schema)
    @doc(description="Register account as parent")
    def post(self, name, surname, email, password, confirmPassword, **kwargs):
        if (password != confirmPassword): raise InvalidUsage.password_dont_match()
        try:
            user = Parent(name, surname, email, password, **kwargs).save().save()
            user.token = create_access_token(identity=user)
        except IntegrityError:
            db.session.rollback()
            raise InvalidUsage.user_already_registered()
        return user


@api.resource('/parent')
@doc(tags=["Parent"])
class ParentResource(MethodResource):
    @jwt_required
    @marshal_with(child_schemas)
    @doc(description="Get all children for a current logged in parent")
    def get(self):
        if not current_user: 
            raise InvalidUsage.user_not_found()
        user = current_user
        if user.type == "parent":
            return user.children
        else:
            raise InvalidUsage.unknown_error()
    
    @jwt_required
    @use_kwargs(register_user_schema)
    @marshal_with(child_schema)
    @doc(description="Register a child to current logged in parent")
    def post(self, name, surname, email, password, confirmPassword, **kwargs):
        if (password != confirmPassword): 
            raise InvalidUsage.password_dont_match()
        if not current_user: 
            raise InvalidUsage.user_not_found()
        try:
            child = Child(name, surname, email, password, current_user, **kwargs).save().save()
        except IntegrityError:
            db.session.rollback()
            raise InvalidUsage.user_already_registered()
        return child


@api.resource('/child')
@doc(tags=["Child"])
class ChildResource(MethodResource):
    @jwt_required
    @marshal_with(parent_schemas)
    @doc(description="Get all parents for a current logged in child")
    def get(self):
        if not current_user: 
            raise InvalidUsage.user_not_found()
        user = current_user
        if user.type == "child":
            return user.parents
        else:
            raise InvalidUsage.unknown_error()