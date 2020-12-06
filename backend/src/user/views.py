# -*- coding: utf-8 -*-
"""User views."""
import datetime as dt

from flask import request
from flask_apispec import use_kwargs, marshal_with, MethodResource
from flask_apispec.annotations import doc
from flask_jwt_extended import jwt_required, jwt_optional, create_access_token, current_user
from sqlalchemy.exc import IntegrityError
from src.database import db

from src.extensions import api
from src.exceptions import InvalidUsage
from .models import User, Parent, Child, Reward
from .schema import user_schema, user_schemas, login_schema, register_user_schema, child_schemas, child_schema, parent_schemas, register_child_schema, register_reward_schema, reward_schema
from requests.auth import HTTPBasicAuth
import requests
from flask import current_app
import json

apiurl = 'https://rest.ehrscape.com/rest/v1/'

@api.resource('/user')
@marshal_with(user_schema)
@doc(tags=["Accounts"])
class AccountResource(MethodResource):
    @jwt_required
    @doc(description="Get current user")
    def get(self):
        if current_user is not None:
            user = current_user
            user.token = request.headers.environ['HTTP_AUTHORIZATION'].split('Token ')[1]
            return current_user
        else:
            raise InvalidUsage.user_not_found()
    
    @jwt_required
    @use_kwargs(user_schema)
    @doc(description="Update current user")
    def put(self, **kwargs):
        user = current_user
        user.update(last_seen=dt.datetime.utcnow())
        user.update(**kwargs)
        return user

    @jwt_required
    @doc(description="Delete parent")
    def delete(self):
        if current_user.type == 'parent':
            current_user.children = []
            db.session.delete(current_user)
            db.session.commit()
            return 200
        else:
            raise InvalidUsage.unknown_error()


    @use_kwargs(login_schema)
    @doc(description="Login user")
    def post(self, email, password, **kwargs):
        user = User.query.filter_by(email=email).first()
        if user is not None and user.check_password(password):
            user.token = create_access_token(identity=user, fresh=True)
            user.update(last_seen=dt.datetime.utcnow())
            return user
        else:
            raise InvalidUsage.user_not_found()
    

@api.resource('/users')
@doc(tags=["Accounts"])
class AccountListResource(MethodResource):
    @marshal_with(user_schemas)
    @doc(description="Get all users in db")
    def get(self):
        users = User.query.all()
        return users

    @use_kwargs(register_user_schema)
    @marshal_with(register_user_schema)
    @doc(description="Register account as parent")
    def post(self, name, surname, email, password, confirmPassword, **kwargs):
        if (password != confirmPassword): raise InvalidUsage.password_dont_match()
        try:
            user = Parent(name, surname, email, password, **kwargs).save().save()
            user.token = create_access_token(identity=user)
        except IntegrityError:
            db.session.rollback()
            raise InvalidUsage.user_already_registered()
        return user



@api.resource('/parent')
@doc(tags=["Parent"])
class ParentResource(MethodResource):
    @jwt_required
    @marshal_with(child_schemas)
    @doc(description="Get all children for a current logged in parent")
    def get(self):
        if not current_user: 
            raise InvalidUsage.user_not_found()
        user = current_user
        if user.type == "parent":
            return user.children
        else:
            raise InvalidUsage.unknown_error()
    
    @jwt_required
    @use_kwargs(register_child_schema)
    @marshal_with(child_schema)
    @doc(description="Register a child to current logged in parent")
    def post(self, name, surname, email, password, confirmPassword, dateofbirth, gender, disease, diseaseInfo, **kwargs):
      
        if (password != confirmPassword): 
            raise InvalidUsage.password_dont_match()
        if not current_user: 
            raise InvalidUsage.user_not_found()
        r = requests.post(apiurl + 'ehr', auth=HTTPBasicAuth(current_app.config['EHR_USER'], current_app.config['EHR_USER_PASS']))
        if r.status_code == 201:
            body = {
                "firstNames": name,
                "lastNames": surname,
                "gender": gender,
                "dateOfBirth": dateofbirth.isoformat(),
                "partyAdditionalInfo": [
                    {
                    "key": "ehrId",
                    "value": r.json()['ehrId']
                    },
                    {
                    "key": "disease",
                    "value": disease
                    }
                ]
                }
            if disease=='DIABETES':
                body['partyAdditionalInfo'].append(
                    {
                    "key": "intendedMeasurements/Day",
                    "value": diseaseInfo["measurements"]
                    }
                )
                body['partyAdditionalInfo'].append(
                    {
                    "key": "SU_LO",
                    "value": diseaseInfo["SU_LO"]
                    }
                )
                body['partyAdditionalInfo'].append(
                    {
                    "key": "SU_HI",
                    "value": diseaseInfo["SU_HI"]
                    }
                )
            if disease=='OBESITY':
                body['partyAdditionalInfo'].append(
                    {
                    "key": "goalweight",
                    "value": diseaseInfo["goalweight"]
                    }
                )
            party = requests.post(apiurl + '/demographics/party', json=body, auth=HTTPBasicAuth(current_app.config['EHR_USER'], current_app.config['EHR_USER_PASS']))
            print(party)
            print(party.status_code)
            if party.status_code == 201:
                try:
                    ehrid = r.json()['ehrId']
                    child = Child(name, surname, email, password, current_user, ehrid, **kwargs)
                    db.session.add(child)
                    db.session.commit()
                    return child
                except IntegrityError:
                    db.session.rollback()
                    raise InvalidUsage.user_already_registered()
            raise InvalidUsage.unknown_error()

@api.resource('/child')
@doc(tags=["Child"])
class ChildResource(MethodResource):
    @jwt_required
    @marshal_with(parent_schemas)
    @doc(description="Get all parents for a current logged in child")
    def get(self):
        if not current_user: 
            raise InvalidUsage.user_not_found()
        user = current_user
        if user.type == "child":
            return user.parents
        else:
            raise InvalidUsage.unknown_error()

    @jwt_required
    @use_kwargs(child_schema)
    @marshal_with(user_schema)
    @doc(description="Update child")
    def put(self, ehrid, **kwargs):
        try:
            user = current_user
            child = Child.query.filter_by(ehrid=ehrid).first()
            child.update(**kwargs)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            raise InvalidUsage.user_already_registered()
        return user
    
    @jwt_required
    @marshal_with(user_schema)
    @doc(description="Delete child")
    def delete(self):
        ehrid = request.args['ehrid']
        child = Child.query.filter_by(ehrid=ehrid).first()
        db.session.delete(child)
        db.session.commit()
        return current_user

@api.resource('/child/timer')
@doc(tags=["Child"])
class ChildTimerResource(MethodResource):
    @jwt_required
    @doc(description="Add timer to child measurement")
    def post(self):
        timer = request.args['timer']
        if timer == 'null':
            current_user.timer = None   
        else:    
            current_user.timer = dt.datetime.strptime(timer, '%Y-%m-%dT%H:%M:%S')
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            raise InvalidUsage.unknown_error()
        return timer

@api.resource('/child/reward')
@doc(tags=["Child"])
class ChildRewardResource(MethodResource):
    @jwt_required
    @use_kwargs(register_reward_schema)
    @marshal_with(reward_schema)
    @doc(description="Add a reward to child")
    def post(self, nameOf, description, reward, endDate, startDate, ehrid, **kwargs):
        #get rid of ID
        child = Child.query.filter_by(ehrid = ehrid).first()
        reward=Reward(nameOf, description, reward, endDate, startDate)
        child.rewards.append(reward)
        db.session.commit()
        return 200
"""
    @jwt_required
    @marshal_with(user_schema)
    @doc(description="Delete reward")
    def delete(self):
        ehrid = request.args['ehrid']
        child = Child.query.filter_by(ehrid=ehrid).first()
        db.session.delete(child)
        db.session.commit()
        return current_user

"""