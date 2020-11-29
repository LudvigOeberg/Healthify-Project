import requests
import random 

# createdAt and lastSeen is not tested.

random = str(random.randint(0, 100000))

email1 = "pnamn1-" + random + "@test.se"
email2 = "pnamn2-" + random + "@test.se"
email3 = "pnamn3-" + random + "@test.se"
email4 = "pnamn4-" + random + "@test.se"
name = "namn"
surname = "efternamn"
password = "a"

localUrl = "http://localhost:5000/"

def registerParent(task):
    url = localUrl+"/api/users"
    return requests.post(url, json=task)


#TestCaseID:3.2.1
def test_registration():
    task =  {"user": {"name": name, "surname": surname, "email": email1, "password": "a", "confirmPassword": "a"}}
    resp = registerParent(task)
    assert resp.status_code == 200
    assert resp.json()["user"]["name"] == name
    assert resp.json()["user"]["surname"] == surname
    assert resp.json()["user"]["email"] == email1;
    assert resp.json()["user"]["type"] == "parent"

    emailExsits = False;
    resp = requests.get(localUrl+"api/users")
    for user in resp.json():
        if (user["user"]["email"] == email1):
            emailExsits = True;

            assert user["user"]["name"] == name
            assert user["user"]["surname"] == surname
            assert user["user"]["type"] == "parent"
            assert user["user"]["children"] == []

    assert emailExsits == True

#TestCaseID:3.2.2
def test_registrationExistingEmail():
    task = {"user": {"name": name, "surname": surname, "email": email2, "password": "a", "confirmPassword": "a"}}
    resp = registerParent(task)
    assert resp.status_code == 200

    task = {"user": {"name": name, "surname": surname, "email": email2, "password": "a", "confirmPassword": "a"}}
    resp = registerParent(task)
    assert resp.status_code == 422

#TestCaseID:3.2.3
def test_loginWrongPassword():
    task = {"user": {"name": name, "surname": surname, "email": email3, "password": "a", "confirmPassword": "a"}}
    resp = registerParent(task)
    assert resp.status_code == 200

    url = localUrl+"api/user"
    task =  {"user": {"email": email3, "password": "b"}}
    resp = requests.post(url, json=task)
    assert resp.status_code == 404

#TestCaseID:3.2.4
def test_loginRightPassword():
    task = {"user": {"name": name, "surname": surname, "email": email4, "password": "a", "confirmPassword": "a"}}
    resp = registerParent(task)
    assert resp.status_code == 200

    url = localUrl+"api/user"
    task =  {"user": {"email": email4, "password": password}}
    resp = requests.post(url, json=task)
    assert resp.status_code == 200

    