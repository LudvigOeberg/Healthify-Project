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
pip3 install -r ./requirements/dev.txt

export FLASK_DEBUG=1
export FLASK_APP=autoapp.py
export ehr_user=<EHR username from RÖ>
export ehr_user_pass=<EHR password from RÖ>

flask db init
flask db migrate
flask db upgrade
flask init-db
```
### Install (windows 10 with git bash)
Only needs to be run once, (or if dependecies are updated or if `venv/` folder is gone).
```sh
python -m venv venv   ### *there may be some problems here
. venv/Source/activate
pip3 install -r ./requirements/dev.txt

export FLASK_DEBUG=1
export FLASK_APP=autoapp.py
export ehr_user=<EHR username from RÖ>
export ehr_user_pass=<EHR password from RÖ>

flask db init ### **there may be some problems here
flask db migrate
flask db upgrade
flask init-db
```
____________________________________________________________________________________________________________________________________________________

*If your terminal says something like "bash: python: command not found" you probably don't have the proper environment variables (miljövariabler in swedish).

To fix this problem you can either uninstall and reinstall python and checking the box "Add Python 3.? to PATH" before installing or you can manually add the path to the environment variables. (? is a place holder for the python version you're installing)

To do the second option follow these steps:
1. Search for edit environment variables for your system (redigera systemets miljövariabler på svenska).
2. On the window that opens press the button environment variables (miljövariabler) located at the bottom.
3. Choose the "path" variable and choose the edit option.
4. Add the paths c:\Users\<username>\AppData\Programs\Python\PythonXY\ and C:\Users\<username>\AppData\Local\Programs\Python\PythonXY\Scripts\
5. Make sure to place these paths at the top of the list of paths

<username> is for example sebbe for me and XY is the representing the version of python you have downloaded for example if you have python 3.9 downloaded X=3 and Y=9 => Python39

**I also had some problems with out of date packages, this can be fixed with the command: pip install --upgrade <packagename>

Feel free to contact Sebastian if you have problems and do not understand this!
____________________________________________________________________________________________________________________________________________________

### Run
To run use the following scripts in order:
```sh
. venv/bin/activate
### use . venv/Scripts/activate if you installed the windows version above
export FLASK_DEBUG=1
export FLASK_APP=autoapp.py
export ehr_user=<EHR username from RÖ>
export ehr_user_pass=<EHR password from RÖ>

flask run
```
The server is running at http://localhost:5000

### Debugging
If there is problem with the backend, or any problems overall; it can often be solved by resetting the database:
1. Remove migrations folder and dev.db, then run:
```sh
. venv/bin/activate
### use . venv/Scripts/activate if you installed the windows version above
export FLASK_DEBUG=1
export FLASK_APP=autoapp.py
export ehr_user=<EHR username from RÖ>
export ehr_user_pass=<EHR password from RÖ>
flask db init ### **there may be some problems here
flask db migrate
flask db upgrade
flask init-db
flask run
```

## Structure
```
.
├── Dockerfile      =>  Builds the app using docker (keep away!)
├── autoapp.py      =>  Main entrypoint for the app
├── src             =>  All code
└── tests           =>  All test code
