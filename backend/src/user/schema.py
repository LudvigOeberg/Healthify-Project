# coding: utf-8
import logging
from marshmallow import Schema, fields, pre_load, post_dump
from src.exceptions import InvalidUsage
from flask import jsonify
import json



class UserSchema(Schema):
    name = fields.Str()
    surname = fields.Str()
    email = fields.Email()
    password = fields.Str(load_only=True)
    confirmPassword = fields.Str(load_only=True)
    token = fields.Str(dump_only=True)
    createdAt = fields.DateTime(attribute='created_at', dump_only=True)
    lastSeen = fields.DateTime(attribute='last_seen', dump_only=True)

    @pre_load
    def make_user(self, data, **kwargs):
        data = data.get('user')
        if not data.get('email', True):
            del data['email']
        return data

    def handle_error(self, exc, data, **kwargs):
        """Log and raise our custom exception when (de)serialization fails."""
        raise InvalidUsage(exc.messages)

    @post_dump
    def dump_user(self, data, **kwargs):
        return {'user': data}

    class Meta:
        strict = True


user_schema = UserSchema()
user_schemas = UserSchema(many=True)