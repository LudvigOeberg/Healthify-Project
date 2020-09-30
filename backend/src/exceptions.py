from flask import jsonify


def template(name='general', data='Something is wrong', code=500):
    return {'message': {name: [data]}, 'status_code': code}

USER_NOT_FOUND = template('general', 'User not found or wrong password', code=404)
PASSWORD_DONT_MATCH = template('password', 'Password dont match', code=404)
USER_ALREADY_REGISTERED = template('email', 'User already registered', code=422)
UNKNOWN_ERROR = template()


class InvalidUsage(Exception):
    status_code = 500

    def __init__(self, message, status_code=None, payload=None):
        self.message = {'errors': message}
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
        Exception.__init__(self)

    def to_json(self):
        rv = self.message
        return jsonify(rv)


    @classmethod
    def unknown_error(cls):
        return cls(**UNKNOWN_ERROR)

    @classmethod
    def user_already_registered(cls):
        return cls(**USER_ALREADY_REGISTERED)
    
    @classmethod
    def user_not_found(cls):
        return cls(**USER_NOT_FOUND)

    @classmethod
    def password_dont_match(cls):
        return cls(**PASSWORD_DONT_MATCH)
