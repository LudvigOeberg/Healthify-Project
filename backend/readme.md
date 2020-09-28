# Backend
Built on Python Flask-RESTful and Swagger for docs.

Visit [/swagger-ui/](http://tddc88-company-2-2020.kubernetes-public.it.liu.se/swagger-ui/) for Swagger RESTful-API documentation.

### Install
```bash
python3 -m venv venv
. venv/bin/activate
pip install -r requirments.txt
```
### Run
```
. venv/bin/activate
export FLASK_DEBUG=1
export FLASK_APP=autoapp.py

flask db init
flask db migrate
flask db upgrade

flask run
```
The server is running at http://localhost:5000

## Structure
```
.
├── Dockerfile      =>  Builds the app using docker (keep away!)
├── autoapp.py      =>  Main entrypoint for the app
├── src             =>  All code
└── tests           =>  All test code