# -*- coding: utf-8 -*-
"""Create an application instance."""
from flask.helpers import get_debug_flag

from src.app import create_app
from src.settings import DevConfig

CONFIG = DevConfig

app = create_app(CONFIG)
