from flask import Flask, request
from flask_cors import CORS, cross_origin
import re

from identify.sqli import identify_sqli
from models.sqli import predict
from correction.sqli import correct_sqli

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route("/predict", methods=["POST"])
@cross_origin(supports_credentials=True)
def prediction():
    if request.method == 'POST':
        query = request.json["query"]
        variables = request.json["variables"]
        ips = request.json["ips"]
        print(query, variables, ips)

        attack = False
        for i in range(0, len(variables)):
            if len(ips[i]) > 0:
                if predict(query, variables[i], ips[i]) == 1:
                    print(query, variables[i], ips[i])
                    attack = True
                    break
        return {"prediction": attack}

@app.route("/sqli", methods=["POST"])
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
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)