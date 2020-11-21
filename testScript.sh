export FLASK_APP=autoapp.py
export FLASK_ENV=development
export NODE_ENV=development

cd backend
python3 -m venv venv
. ./venv/bin/activate
pip3 install -r ./backend/requirements/dev.txt

flask db init
flask db migrate
flask db upgrade
flask init-db
cd ..

(echo "BACKEND!" && cd backend && flask run) & (echo "FRONTEND!" && serve -s frontend/build -l 4100) & (sleep 15 && cd frontend && echo "TESTING!" && npm run jest startpage.js)

jobs
kill %1
kill %2
echo "Done"