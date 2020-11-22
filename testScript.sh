export DEBIAN_FRONTEND=noninteractive
export TZ=Europe/Stockholm
export ehr_user=${K8S_SECRET_EHR_USER%123}
export ehr_user_pass=$K8S_SECRET_EHR_USER_PASS
export FLASK_APP=autoapp.py; export FLASK_ENV=development; export NODE_ENV=development

apt-get -qq update -y
apt-get -qq install -y python3-dev python3-pip python3-venv nodejs npm default-jre curl
apt-get -f install

cd frontend
npm i --silent -g serve
npm i --silent

cd ../backend
python3 -m venv venv
. ./venv/bin/activate
pip3 install -r requirements.txt
pip3 install -r ./requirements/dev.txt
flask db init; flask db migrate; flask db upgrade; flask init-db

cd ..
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
(echo "BACKEND!" && cd backend && flask run) & (echo "FRONTEND!" && serve -s frontend/build -l 4100) & (sleep 15 && cd frontend && echo "TESTING!" && npm run jest startpage.js) &

curl -L localhost:5000/swagger-ui
curl -L localhost:4100

echo "Done"