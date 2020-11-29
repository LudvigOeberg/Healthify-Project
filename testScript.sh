export FLASK_APP=backend/autoapp.py
export FLASK_ENV=development
export NODE_ENV=development
export ehr_user=""
export ehr_user_pass=""

python3 -m venv ./backend/venv
. ./backend/venv/bin/activate
pip3 install -r ./backend/requirements/dev.txt

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
flask db init
flask db migrate
flask db upgrade
flask init-db

(echo "BACKEND!" && flask run) & (echo "FRONTEND!" && serve -s frontend/build -l 4100) & (sleep 15 && cd frontend && echo "TESTING!" && npm run jest startpage.js)

wait
=======
=======
>>>>>>> master
=======
>>>>>>> a77d64ad31630c8aa8f51d3885ae010e74c36707
=======
>>>>>>> Test-webdriver-test-case
#flask db init
#flask db migrate
#flask db upgrade
#flask init-db

<<<<<<< HEAD
<<<<<<< HEAD
flask run & serve -s frontend/build & (sleep 15 && cd frontend && npm run jest)
<<<<<<< HEAD
>>>>>>> testing script ci/cd
=======
flask run & serve -s frontend/build & (sleep 15 && cd frontend && npm run jest)
>>>>>>> master
=======
flask run & serve -s frontend/build & (sleep 15 && cd frontend && npm run jest)
>>>>>>> a77d64ad31630c8aa8f51d3885ae010e74c36707
=======

>>>>>>> Test-webdriver-test-case
