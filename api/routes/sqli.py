from flask import Blueprint, request
from flask_cors import cross_origin

from identify.sqli import identify_sqli
from models.sqli import predict
from correction.sqli import correct_sqli

bp = Blueprint("sqli", __name__, url_prefix="/sqli")

@bp.route("/predict", methods=["POST"])
@cross_origin(supports_credentials=True)
def predict_sqli():
    if request.method == 'POST':
        ips = request.json["ips"]
        print(ips)

        attack = False
        for i in range(0, len(ips)):
            if len(ips[i]) > 0:
                if predict(ips[i]) == 1:
                    print(ips[i])
                    attack = True
                    break
        if (attack):
            return {"prediction": attack, "title": "SQLi detected", "description": "Possible SQL injection attack"}
        else:
            return {"prediction": attack, "title": "All clear", "description": "Not an attack"}

@bp.route("/identify", methods=["POST"])
@cross_origin(supports_credentials=True)
def sqli():
    if request.method == 'POST':
        php = request.json["line"]
        vars = identify_sqli(php)

        msg = ""
        correction = []

        if len(vars) == 1:
            if (len(vars[0][1]) > 0):
                msg = "Maybe vulnerable"
                correction = correct_sqli(vars[0][0])
                vars = vars[0][1]
            else:
                msg = "Not directly vulnerable"
                vars = []
        else:
            msg = "No SQL statement found"

        print(correction)
        return {"msg": msg, "vars": vars, "correction": correction}