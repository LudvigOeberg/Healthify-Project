# coding: utf-8

from marshmallow import Schema, fields, pre_load, post_dump


class UserSchema(Schema):
    username = fields.Str()
    email = fields.Email()
    password = fields.Str(load_only=True)
    token = fields.Str(dump_only=True)
    createdAt = fields.DateTime(attribute='created_at', dump_only=True)
    lastSeen = fields.DateTime(attribute='last_seen', dump_only=True)

    @pre_load
    def make_user(self, data, **kwargs):
        if not data.get('email', True):
            del data['email']
        return data

    @post_dump
    def dump_user(self, data, **kwargs):
        return {'user': data}

    class Meta:
        strict = True


user_schema = UserSchema()
user_schemas = UserSchema(many=True)