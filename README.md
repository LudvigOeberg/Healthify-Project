# TDDC88 - Healthify

### Instructions
All available scripts explained in `frontend/` and `backend/` must be run in these directories.

#### Local development
1. Start backend
```bash
cd backend
. venv/bin/activate
export FLASK_APP=autoapp.py
export FLASK_DEBUG=1
export ehr_user=<EHR username from RÖ>
export ehr_user_pass=<EHR password from RÖ>
### If you don' have dev.db and migrations in your backend-dir run these scripts:
flask db init
flask db migrate
flask db upgrade
flask init-db
### 
flask run
```
2. Start frontend
```bash
cd frontend
export NODE_ENV=development
npm start
### If npm fails, make sure you have the latest package.json and run:
npm install
### If it still fails to run, try removing node_modules and package-lock.json 
### and run above script again.
```


### Live Version of Healthify
Go to [Healtify](http://tddc88-company-2-2020.kubernetes-public.it.liu.se) to see the live deployment!

Two accounts added:
1. Parent
   - p@test.se
   - test123
2. Child
   - c@test.se
   - test123

### Company Website - GitLab Pages
[Checkout our team!](https://tddc88-company-2-2020.gitlab-pages.liu.se/deploy/)

## Structure

```
.
├── backend     =>  flask backend-server
├── frontend    =>  react.js frontend-server 
├── public      =>  gitlab-pages, company website
└── yaml        =>  .yml files for kubernetes (keep away!)
````