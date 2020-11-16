# coding: utf-8
import logging
from marshmallow import Schema, fields, pre_load, post_dump, validate, ValidationError
from src.exceptions import InvalidUsage
from flask import jsonify
import json


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, validate=validate.Length(min=1), required=True)
    
    name = fields.Str(dump_only=True)
    surname = fields.Str(dump_only=True)
    token = fields.Str(dump_only=True)
    createdAt = fields.DateTime(attribute='created_at', dump_only=True)
    lastSeen = fields.DateTime(attribute='last_seen', dump_only=True)
    type = fields.Str(dump_only=True)

    @pre_load
    def make_user(self, data, **kwargs):
        data = data.get('user')
        return data

    def handle_error(self, exc, data, **kwargs):
        """Log and raise our custom exception when (de)serialization fails."""
        raise InvalidUsage(exc.messages)

    @post_dump
    def dump_user(self, data, **kwargs):
        return {'user': data}

    class Meta:
        strict = True


class UserSchema(Schema):
    name = fields.Str(validate=validate.Length(min=1))
    surname = fields.Str(validate=validate.Length(min=1))
    email = fields.Email()
    token = fields.Str(dump_only=True)
    createdAt = fields.DateTime(attribute='created_at', dump_only=True)
    lastSeen = fields.DateTime(attribute='last_seen', dump_only=True)
    children = fields.List(fields.Nested(lambda: ChildSchema()), dump_only=True)
    parents = fields.List(fields.Nested(lambda: UserSchema(exclude=("children", "parents", "token"))), dump_only=True)
    ehrid = fields.Str(dump_only=True)
    type = fields.Str(dump_only=True)
    timer = fields.DateTime(dump_only=True)

    @pre_load
    def make_user(self, data, **kwargs):
        data = data.get('user')
        return data

    def handle_error(self, exc, data, **kwargs):
        """Log and raise our custom exception when (de)serialization fails."""
        raise InvalidUsage(exc.messages)

    @post_dump
    def dump_user(self, data, **kwargs):
        return {'user': data}

    class Meta:
        strict = True


class RegisterUserSchema(Schema):
    name = fields.Str(validate=validate.Length(min=1), required=True)
    surname = fields.Str(validate=validate.Length(min=1), required=True)
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, validate=validate.Length(min=1), required=True)
    confirmPassword = fields.Str(load_only=True, validate=validate.Length(min=1), required=True)
    token = fields.Str(dump_only=True)
    createdAt = fields.DateTime(attribute='created_at', dump_only=True)
    lastSeen = fields.DateTime(attribute='last_seen', dump_only=True)
    type = fields.Str(dump_only=True)

    @pre_load
    def make_user(self, data, **kwargs):
        data = data.get('user')
        return data

    def handle_error(self, exc, data, **kwargs):
        """Log and raise our custom exception when (de)serialization fails."""
        raise InvalidUsage(exc.messages)

    @post_dump
    def dump_user(self, data, **kwargs):
        return {'user': data}

    class Meta:
        strict = True


class RegisterChildSchema(Schema):
    name = fields.Str(validate=validate.Length(min=1), required=True)
    surname = fields.Str(validate=validate.Length(min=1), required=True)
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, validate=validate.Length(min=1), required=True)
    confirmPassword = fields.Str(load_only=True, validate=validate.Length(min=1), required=True)
    gender = fields.Str(validate=(validate.OneOf(["MALE", "FEMALE", "UNKNOWN", "OTHER"])), required=True)
    dateofbirth = fields.DateTime(format="iso", required=True)
    disease = fields.Str(validate=(validate.OneOf(["DIABETES", "OBESITY"])), required=True)
    token = fields.Str(dump_only=True)
    createdAt = fields.DateTime(attribute='created_at', dump_only=True)
    lastSeen = fields.DateTime(attribute='last_seen', dump_only=True)
    type = fields.Str(dump_only=True)

    @pre_load
    def make_user(self, data, **kwargs):
        data = data.get('user')
        return data

    def handle_error(self, exc, data, **kwargs):
        """Log and raise our custom exception when (de)serialization fails."""
        raise InvalidUsage(exc.messages)

    @post_dump
    def dump_user(self, data, **kwargs):
        return {'user': data}

    class Meta:
        strict = True


class ChildSchema(Schema):
    name = fields.Str(dump_only=True)
    surname = fields.Str(dump_only=True)
    email = fields.Email()
    ehrid = fields.Str()
    createdAt = fields.DateTime(attribute='created_at', dump_only=True)
    lastSeen = fields.DateTime(attribute='last_seen', dump_only=True)
    type = fields.Str(dump_only=True)
    timer = fields.DateTime(dump_only=True)

    @pre_load
    def make_user(self, data, **kwargs):
        data = data.get('user')
        return data

    def handle_error(self, exc, data, **kwargs):
        """Log and raise our custom exception when (de)serialization fails."""
        raise InvalidUsage(exc.messages)

    @post_dump
    def dump_user(self, data, **kwargs):
        return {'child': data}

    class Meta:
        strict = True


class ParentSchema(Schema):
    name = fields.Str(dump_only=True)
    surname = fields.Str(dump_only=True)
    email = fields.Email(dump_only=True)
    createdAt = fields.DateTime(attribute='created_at', dump_only=True)
    lastSeen = fields.DateTime(attribute='last_seen', dump_only=True)
    type = fields.Str(dump_only=True)

    @pre_load
    def make_user(self, data, **kwargs):
        data = data.get('user')
        return data

    def handle_error(self, exc, data, **kwargs):
        """Log and raise our custom exception when (de)serialization fails."""
        raise InvalidUsage(exc.messages)

    @post_dump
    def dump_user(self, data, **kwargs):
        return {'child': data}

    class Meta:
        strict = True



login_schema = LoginSchema()
register_user_schema = RegisterUserSchema()
register_child_schema = RegisterChildSchema()
user_schema = UserSchema()
user_schemas = UserSchema(many=True)
child_schema = ChildSchema()
child_schemas = ChildSchema(many=True)
parent_schemas = ParentSchema(many=True)