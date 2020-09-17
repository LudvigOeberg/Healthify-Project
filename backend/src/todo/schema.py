# coding: utf-8

from marshmallow import Schema, fields, post_dump, pre_load


class TodoSchema(Schema):
    name = fields.Str()
    desc = fields.Str()
    createdAt = fields.DateTime(attribute='created_at', dump_only=True)
    updatedAt = fields.DateTime(attribute='updated_at', dump_only=True)

    @pre_load
    def make_todo(self, data, **kwargs):
        return data

    @post_dump
    def dump_todo(self, data, **kwargs):
        return {'todo': data}

    class Meta:
        strict = True


todo_schema = TodoSchema()
todo_schemas = TodoSchema(many=True)
