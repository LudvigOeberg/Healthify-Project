# -*- coding: utf-8 -*-
"""The app module, containing the app factory function."""
from flask import Flask
from src.extensions import bcrypt, cache, db, migrate, jwt, cors, docs, api

from src import commands, user, todo
from src.settings import ProdConfig
from src.exceptions import InvalidUsage


def create_app(config_object=ProdConfig):
    """An application factory, as explained here:
    http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = Flask(__name__.split('.')[0])
    app.url_map.strict_slashes = False
    app.config.from_object(config_object)
    register_extensions(app)
    register_errorhandlers(app)
    register_shellcontext(app)
    register_commands(app)
    register_docs(app)
    return app


def register_extensions(app):
    """Register Flask extensions."""
    origins = app.config.get('CORS_ORIGIN_WHITELIST', '*')
    cors.init_app(app, resources={r"/api/*": {"origins": origins}})
    bcrypt.init_app(app)
    cache.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    docs.init_app(app)
    api.init_app(app)


def register_docs(app):
    """Register Swagger docs."""
    docs.register(todo.views.TodoResource)
    docs.register(todo.views.TodoListResource)
    docs.register(user.views.UserResource)
    docs.register(user.views.UserListResource)


def register_errorhandlers(app):

    def errorhandler(error):
        response = error.to_json()
        response.status_code = error.status_code
        return response

    app.errorhandler(InvalidUsage)(errorhandler)


def register_shellcontext(app):
    """Register shell context objects."""
    def shell_context():
        """Shell context objects."""
        return {
            'db': db,
            'User': user.models.User,
            'Todo': todo.models.Todo,
        }

    app.shell_context_processor(shell_context)


def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.test)
    app.cli.add_command(commands.lint)
    app.cli.add_command(commands.clean)
    app.cli.add_command(commands.urls)
