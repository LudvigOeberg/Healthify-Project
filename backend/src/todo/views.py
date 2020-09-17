# -*- coding: utf-8 -*-
"""Todo views."""
import datetime as dt

from flask import request
from flask_apispec import MethodResource, marshal_with, use_kwargs
from flask_apispec.annotations import doc
from flask_jwt_extended import (create_access_token, current_user,
                                jwt_optional, jwt_required)
from sqlalchemy.exc import IntegrityError

from src.database import db
from src.exceptions import InvalidUsage
from src.extensions import api

from .models import Todo
from .schema import todo_schema, todo_schemas


@api.resource('/todo/<int:id>')
@marshal_with(todo_schema)
@doc(tags=["TodoList"])
class TodoResource(MethodResource):
    def get(self, id):
        todo = Todo.get_by_id(id)
        if not todo:
            raise InvalidUsage.todo_not_found()
        return todo

    @use_kwargs(todo_schema)
    def put(self, id, **kwargs):
        todo = Todo.get_by_id(id)
        if not todo:
            raise InvalidUsage.todo_not_found()
        todo.update(updatedAt=dt.datetime.utcnow(), **kwargs)
        todo.save()
        return todo

    def delete(self, id):
        todo = Todo.get_by_id(id)
        todo.delete()
        return '', 200


@api.resource('/todos')
@doc(tags=["TodoList"])
class TodoListResource(MethodResource):
    @marshal_with(todo_schemas)
    def get(self, limit=20, offset=0):
        todolist = Todo.query.offset(offset).limit(limit).all()
        return todolist

    @use_kwargs(todo_schema)
    @marshal_with(todo_schema)
    def post(self, **kwargs):
        todo = Todo(**kwargs)
        todo.save()
        return todo
