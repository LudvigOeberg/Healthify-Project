# Backend

Built on Python Flask-RESTful and Swagger for docs.

Visit /swagger-ui/ for Swagger documentation.

Install:
```bash
python3 -m venv venv
. venv/bin/activate
pip install -r requirments.txt

export FLASK_DEBUG=1
export FLASK_APP=autoapp.py

flask db init
flask db migrate
flask db upgrade

flask run