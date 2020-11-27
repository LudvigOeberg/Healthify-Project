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

class DiabetesInfoSchema(Schema):
    measurements= fields.Int(validate=validate.Range(min=1, max=20), required=True)
    SU_LO= fields.Float(validate=validate.Range(min=0, max=15), required=True)
    SU_HI= fields.Float(validate=validate.Range(min=0, max=15), required=True)    

class ObesityInfoSchema(Schema):
    goalweight = fields.Int(validate=validate.Range(min=40, max=60), required=True)

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
    diseaseInfo = fields.Nested(DiabetesInfoSchema())
    type = fields.Str(dump_only=True)

    @pre_load
    def make_user(self, data, **kwargs):
        data = data.get('user')
        if data.get('disease')=="OBESITY":
            self.declared_fields.update({'diseaseInfo': fields.Nested(ObesityInfoSchema())})
            self.load_fields.update({'diseaseInfo': fields.Nested(ObesityInfoSchema())})
            self.fields.update({'diseaseInfo': fields.Nested(ObesityInfoSchema())})
            self.dump_fields.update({'diseaseInfo': fields.Nested(ObesityInfoSchema())})
        return data

    def handle_error(self, exc, data, **kwargs):
        """Log and raise our custom exception when (de)serialization fails."""
        raise InvalidUsage(exc.messages)

    @post_dump
    def dump_user(self, data, **kwargs):
        return {'user': data}

    class Meta:
        strict = True

class RewardSchema(Schema):
    nameOf = fields.Str()
    description = fields.Str()
    reward = fields.Str()
    endDate = fields.Date()
    ehrid = fields.Str()

    @pre_load
    def make_reward(self, data, **kwargs):
        data = data.get('reward')
        return data

class RegisterRewardSchema(Schema):
    nameOf = fields.Str(required=True)
    description = fields.Str(required=True)
    reward = fields.Str(required=True)
    endDate = fields.Date(required=True)
    ehrid = fields.Str(required=True)

    @pre_load
    def make_reward(self, data, **kwargs):
        data = data.get('reward')
        return data

class ChildSchema(Schema):
    name = fields.Str(dump_only=True)
    surname = fields.Str(dump_only=True)
    email = fields.Email()
    ehrid = fields.Str()
    createdAt = fields.DateTime(attribute='created_at', dump_only=True)
    lastSeen = fields.DateTime(attribute='last_seen', dump_only=True)
    type = fields.Str(dump_only=True)
    timer = fields.DateTime(dump_only=True)
    rewards = fields.List(fields.Nested(lambda:RewardSchema()))

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
register_reward_schema = RegisterRewardSchema()
reward_schema = RewardSchema()