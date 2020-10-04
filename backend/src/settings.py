# -*- coding: utf-8 -*-
"""Application configuration."""
import os
from datetime import timedelta
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin

class Config(object):
    """Base configuration."""

    SECRET_KEY = os.environ.get('SRC_SECRET', 'secret-key')
    APP_DIR = os.path.abspath(os.path.dirname(__file__))  # This directory
    PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))
    TEST_PATH = os.path.join(PROJECT_ROOT, 'tests')
    BCRYPT_LOG_ROUNDS = 13
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    CACHE_TYPE = 'simple'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_AUTH_USERNAME_KEY = 'email'
    JWT_AUTH_HEADER_PREFIX = 'Token'
    CORS_ORIGIN_WHITELIST = [
        'http://0.0.0.0:4100',
        'http://localhost:4100',
        'http://0.0.0.0:8000',
        'http://localhost:8000',
        'http://0.0.0.0:4200',
        'http://localhost:4200',
        'http://0.0.0.0:4000',
        'http://localhost:4000',
        'http://localhost:80',
        'http://0.0.0.0:80',
    ]
    JWT_HEADER_TYPE = 'Token'
    APISPEC_SPEC = APISpec(
                title='RESTful API - Healthify',
                version='v1',
                openapi_version='2.0',
                info=dict(description='Swagger docs for exploring the API'),
                plugins=[MarshmallowPlugin()],
            )
    APISPEC_SWAGGER_URL = "/api/swagger"
    APISPEC_SWAGGER_UI_URL = "/swagger-ui"


class ProdConfig(Config):
    """Production configuration."""

    ENV = 'prod'
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL',
                                             'postgresql://postgresadmin:admin123@localhost/postgres')


class DevConfig(Config):
    """Development configuration."""

    ENV = 'dev'
    DEBUG = True
    DB_NAME = 'dev.db'
    DB_PATH = os.path.join(Config.PROJECT_ROOT, DB_NAME)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///{0}'.format(DB_PATH)
    CACHE_TYPE = 'simple'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(10 ** 6)


class TestConfig(Config):
    """Test configuration."""

    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    BCRYPT_LOG_ROUNDS = 4
