from flask import Blueprint, request
from flask_cors import cross_origin

from identify.xss import identify_xss
from models.xss import predict
from correction.xss import correct_xss

bp = Blueprint("xss", __name__, url_prefix="/xss")

@bp.route("/predict", methods=["POST"])
@cross_origin(supports_credentials=True)
def predict_xss():
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
            return {"prediction": attack, "title": "XSS detected", "description": "Possible cross site scripting attack"}
        else:
            return {"prediction": attack, "title": "All clear", "description": "Not an attack"}

@bp.route("/identify", methods=["POST"])
@cross_origin(supports_credentials=True)
def xss():
    if request.method == 'POST':
        php = request.json["line"]
        vars = identify_xss(php)

        msg = ""
        correction = []
        
        if vars[2] != -1:
            msg = "Maybe vulnerable"
            correction = correct_xss(vars[0], vars[2])
            vars = vars[1]
        else:
            msg = "Not directly vulnerable"
            vars = []
        

        print(correction)
        return {"msg": msg, "vars": vars, "correction": correction}