# Backend
Built on Python Flask-RESTful and Swagger for docs.

Visit [/swagger-ui/](http://tddc88-company-2-2020.kubernetes-public.it.liu.se/swagger-ui/) for Swagger RESTful-API documentation.

## Available Scripts

In the project directory, use following scripts to install and run:

### Install
Only needs to be run once, (or if dependecies are updated or if `venv/` folder is gone).
```sh
python3 -m venv venv
. venv/bin/activate
pip install -r requirments.txt

export FLASK_DEBUG=1
export FLASK_APP=autoapp.py

flask db init
flask db migrate
flask db upgrade
```
### Run
To run use the following scripts in order:
```sh
. venv/bin/activate
export FLASK_DEBUG=1
export FLASK_APP=autoapp.py

#if there are changes to db classes
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