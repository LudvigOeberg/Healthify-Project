import requests
import random

# createdAt and lastSeen is not tested.

random = str(random.randint(0, 100000))

name = "namn"
surname = "efternamn"
password = "a"
email1 = "parent1-" + random + "@test.se"
email2 = "parent2-" + random + "@test.se"
email3 = "parent3-" + random + "@test.se"
email4 = "parent4-" + random + "@test.se"
email5 = "parent5-" + random + "@test.se"
email6 = "parent6-" + random + "@test.se"
email7 = "parent7-" + random + "@test.se"
email8 = "parent8-" + random + "@test.se"
email9 = "parent9-" + random + "@test.se"

nameC = "namn"
surnameC = "efternamn"
passwordC = "a"
dateOfBirth = "2012-11-11T00:00:00.000Z"
gender = "MALE"
disease = "OBESITY"

emailC = "child1-" + random + "@test.se"
emailC2 = "child2-" + random + "@test.se"
emailC3 = "child3-" + random + "@test.se"
emailC4 = "child4-" + random + "@test.se"
emailC5 = "child5-" + random + "@test.se"
emailC6 = "child6-" + random + "@test.se"
emailC7 = "child7-" + random + "@test.se"
emailC8 = "child8-" + random + "@test.se"
emailC9 = "child9-" + random + "@test.se"

localUrl = "http://localhost:5000/"

class Child:
    name = "namn"
    surname ="efternamn"
    password = "a"
    confirmPassword = "a"
    dateOfBirth = "2012-11-11T00:00:00.000Z"
    email = ""
    gender = ""
    disease = ""

    def __init__(self, email, gender, disease):
        self.email = email
        self.gender = gender
        self.disease = disease


def addChild(headers, task):
    urlParent = localUrl+"api/parent"
    return requests.post(urlParent, headers=headers, json=task)

def assertChild(headers, resp, child):
    assert resp.status_code == 200
    assert resp.json()["child"]["name"] == child.name
    assert resp.json()["child"]["surname"] == child.surname
    assert resp.json()["child"]["email"] == child.email
    assert resp.json()["child"]["type"] == "child"

    url = localUrl+"api/user"
    resp = requests.get(url, headers=headers)
    parentHasTheChild = False
    for childs in resp.json()["user"]["children"]:
              if (childs["child"]["email"] == child.email):
                  parentHasTheChild = True
                  assert (childs["child"]["name"] == child.name)
                  assert (childs["child"]["surname"] == child.surname)
                  assert (childs["child"]["type"] == "child")
    assert parentHasTheChild == True  

def registerParent(email):
    url = localUrl+"api/users"
    task =  {"user": {"name": name, "surname": surname, "email": email, "password": "a", "confirmPassword": "a"}}
    resp = requests.post(url, json=task)
    assert resp.status_code == 200
    return resp.json()["user"]["token"]

def test_addChildWithObesity_ValuesOnLowerBoundary():
    token = registerParent(email5)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC2, "FEMALE", "OBESITY")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": {"goalweight": 40}}}
    resp = addChild(headers, task)
    assert resp.status_code == 200

def test_addChildWithObesity_NoValues():
    token = registerParent(email6)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC3, "FEMALE", "OBESITY")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": { }}}
    resp = addChild(headers, task)
    assert resp.status_code == 500 

def test_addChildWithObesity_ValuesOnUpperBoundary():
    token = registerParent(email7)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC4, "FEMALE", "OBESITY")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": {"goalweight": 60}}}
    resp = addChild(headers, task)
    assert resp.status_code == 200

def test_addChildWithObesity_ValuesBelowLowerBoundary():
    token = registerParent(email8)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC5, "FEMALE", "OBESITY")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": {"goalweight": 20}}}
    resp = addChild(headers, task)
    assert resp.status_code == 500

def test_addChildWithObesity_ValuesAboveUpperBoundary():
    token = registerParent(email9)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC6, "FEMALE", "OBESITY")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": {"goalweight": 70}}}
    resp = addChild(headers, task)
    assert resp.status_code == 500

