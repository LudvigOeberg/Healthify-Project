export FLASK_APP=backend/autoapp.py
export FLASK_ENV=development
export NODE_ENV=development
export ehr_user=""
export ehr_user_pass=""

python3 -m venv ./backend/venv
. ./backend/venv/bin/activate
pip3 install -r ./backend/requirements/dev.txt

<<<<<<< HEAD
flask db init
flask db migrate
flask db upgrade
flask init-db

(echo "BACKEND!" && flask run) & (echo "FRONTEND!" && serve -s frontend/build -l 4100) & (sleep 15 && cd frontend && echo "TESTING!" && npm run jest startpage.js)

wait
=======
#flask db init
#flask db migrate
#flask db upgrade
#flask init-db

flask run & serve -s frontend/build & (sleep 15 && cd frontend && npm run jest)
>>>>>>> testing script ci/cd
