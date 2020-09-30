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
from .models import User
from .schema import user_schema, user_schemas


@api.resource('/user')
@marshal_with(user_schema)
@doc(tags=["User"])
class UserResource(MethodResource):
    @jwt_required
    @doc(description="Get current user")
    def get(self):
        user = current_user
        user.token = request.headers.environ['HTTP_AUTHORIZATION'].split('Token ')[1]
        return current_user
    
    @use_kwargs(user_schema)
    @jwt_required
    @doc(description="Update user")
    def put(self, **kwargs):
        user = current_user
        # take in consideration the password
        password = kwargs.pop('password', None)
        if password:
            user.set_password(password)
        user.update(last_seen=dt.datetime.utcnow())
        user.update(**kwargs)
        return user

    @jwt_optional
    @use_kwargs(user_schema)
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
@doc(tags=["User"])
class UserListResource(MethodResource):
    @marshal_with(user_schemas)
    @doc(tags=["User"], description="Get all users")
    def get(self):
        users = User.query.all()
        return users

    @use_kwargs(user_schema)
    @marshal_with(user_schema)
    @doc(tags=["User"], description="Register user")
    def post(self, name, surname, email, password, confirmPassword, **kwargs):
        if (password != confirmPassword): raise InvalidUsage.password_dont_match()
        try:
            user = User(name, surname, email, password, **kwargs).save().save()
            user.token = create_access_token(identity=user)
        except IntegrityError:
            db.session.rollback()
            raise InvalidUsage.user_already_registered()
        return user
