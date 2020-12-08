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

#TestCaseID:22.3.1
def test_addChild():
    token = registerParent(email3)
    child = Child(emailC4, "FEMALE", "OBESITY")
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    task1 =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": {"goalweight": 50}}}
    resp = addChild(headers, task1)
    assertChild(headers, resp, child)  

#TestCaseID:22.3.2
def test_addChildren():
    token = registerParent(email1)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}

    child1 = Child(emailC, "FEMALE", "OBESITY")
    task1 =  {"user": {"name": child1.name, "surname": child1.surname, "email": child1.email, "password": child1.password, "confirmPassword": child1.confirmPassword,
     "dateofbirth": child1.dateOfBirth, "gender": child1.gender, "disease": child1.disease, "diseaseInfo": {"goalweight": 50}}}
    resp = addChild(headers, task1)
    assert resp.status_code == 200
    resp = requests.get(localUrl+"api/user", headers=headers)
    parentHasTheChild = False
    for childs in resp.json()["user"]["children"]:
            if (childs["child"]["email"] == emailC):
                parentHasTheChild = True
    assert parentHasTheChild == True  

    
    child2 = Child(emailC2, "FEMALE", "OBESITY")
    task2 =  {"user": {"name": child2.name, "surname": child2.surname, "email": child2.email, "password": child2.password, "confirmPassword": child2.confirmPassword,
     "dateofbirth": child2.dateOfBirth, "gender": child2.gender, "disease": child2.disease, "diseaseInfo": {"goalweight": 50}}}
    resp2 = addChild(headers, task2)
    assert resp2.status_code == 200
    resp2 = requests.get(localUrl+"api/user", headers=headers)
    parentHasTheChild = False
    for childs in resp2.json()["user"]["children"]:
              if (childs["child"]["email"] == emailC2):
                  parentHasTheChild = True
    assert parentHasTheChild == True  

#TestCaseID:22.3.3
def test_addSameChildAgain():
    token = registerParent(email2)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC3, "FEMALE", "OBESITY")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": {"goalweight": 50}}}
    resp = addChild(headers, task)
    assert resp.status_code == 200
    resp2 = addChild(headers, task)
    assert resp2.status_code == 422 


#TestCaseID:22.3.4
def test_addChildWithInvalidData():
    token = registerParent(email4)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    task1 =  {"user": {"name": "", "surname": "", "email": "", "password": "", "confirmPassword": "",
     "dateofbirth": "", "gender": "", "disease": "" }}
    resp = addChild(headers, task1)
    assert resp.status_code == 500  


#TestCaseID:98.3.1
def test_addChildWithDiabetes_ValuesOnLowerBoundary():
    token = registerParent(email5)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC5, "FEMALE", "DIABETES")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": { "SU_HI": 0, "SU_LO": 0, "measurements": 1}}}
    resp = addChild(headers, task)
    assert resp.status_code == 200 

#TestCaseID:98.3.2
def test_addChildWithDiabetes_NoValues():
    token = registerParent(email6)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC6, "FEMALE", "DIABETES")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": { "SU_HI": "", "SU_LO": "", "measurements": ""}}}
    resp = addChild(headers, task)
    assert resp.status_code == 500 

#TestCaseID:98.3.3
def test_addChildWithDiabetes_ValuesOnUpperBoundary():
    token = registerParent(email7)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC7, "FEMALE", "DIABETES")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": { "SU_HI": 15, "SU_LO": 15, "measurements": 20}}}
    resp = addChild(headers, task)
    assert resp.status_code == 200 

#TestCaseID:98.3.4
def test_addChildWithDiabetes_ValuesUnderLowerBoundary():
    token = registerParent(email8)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC8, "FEMALE", "DIABETES")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": { "SU_HI": -1, "SU_LO": -1, "measurements": -1}}}
    resp = addChild(headers, task)
    assert resp.status_code == 500 

#TestCaseID:98.3.5
def test_addChildWithDiabetes_ValuesOverUpperBoundary():
    token = registerParent(email9)
    headers = {'authorization': 'Token ' + token, 'Content-Type': 'application/json'}
    child = Child(emailC9, "FEMALE", "DIABETES")
    task =  {"user": {"name": child.name, "surname": child.surname, "email": child.email, "password": child.password, "confirmPassword": child.confirmPassword,
     "dateofbirth": child.dateOfBirth, "gender": child.gender, "disease": child.disease, "diseaseInfo": { "SU_HI": 16, "SU_LO": 16, "measurements": 21}}}
    resp = addChild(headers, task)
    assert resp.status_code == 500 