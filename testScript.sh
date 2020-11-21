export FLASK_APP=backend/autoapp.py
export FLASK_ENV=development
export NODE_ENV=development

python3 -m venv ./backend/venv
. ./backend/venv/bin/activate
pip3 install -r ./backend/requirements/dev.txt

flask db init
flask db migrate
flask db upgrade
flask init-db

(echo "BACKEND!" && flask run) & (echo "FRONTEND!" && serve -s frontend/build -l 4100) & (sleep 15 && cd frontend && echo "TESTING!" && npm run jest startpage.js)

wait %3
kill %1
kill %2
echo "Done"