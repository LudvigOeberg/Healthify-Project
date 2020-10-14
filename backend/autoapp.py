# -*- coding: utf-8 -*-
"""Create an application instance."""
from flask.helpers import get_debug_flag

from src.app import create_app
from src.settings import DevConfig, ProdConfig

CONFIG = DevConfig if get_debug_flag() else ProdConfig
print(CONFIG.EHR_USER)
print(CONFIG.EHR_USER_PASS)
app = create_app(CONFIG)
