from flask import Flask, request
from flask_cors import CORS, cross_origin
import re
import nltk
from nltk.tokenize import RegexpTokenizer

app = Flask(__name__)
CORS(app, support_credentials=True)

def RETokenizer(query):
    pattern = r'\$?\w+'
    tokenizer = RegexpTokenizer(pattern)
    tokens = tokenizer.tokenize(query)
    return tokens

def find_vars(tokens, query):
    variables = []
    for token in tokens:
        if token.startswith("$"): #and query.index(token) > query.index("WHERE"):
            datatype = "int"
            if "date" in token:
                datatype = "date"
            if token.startswith("$is"):
                datatype = "bool"
            if query[query.index(token) - 1] in ["'", "\""]:
                datatype = "str"
            variables.append((token, datatype))
    return variables

def create_pstmt(query, variables):
    pstmt = query
    for name, datatype in variables:
        placeholder = "?"
        if datatype == "date":
            placeholder = "TO_DATE(?, 'YYYY-MM-DD')"
        pstmt = pstmt.replace(name, placeholder, 1)
    return pstmt

def correction(query):
    corrections = []
    tokens = RETokenizer(query)
    corrections.append("Statement type " + tokens[0])

    variables = find_vars(tokens, query)
    pstmt = create_pstmt(query, variables)
    corrections.append(pstmt)
    
    for i, var in enumerate(variables):
        corrections.append("bind(" + var[0] + ", " + str(i) + ")")
    return corrections

@app.route("/query", methods=["POST"])
@cross_origin(supports_credentials=True)
def query():
    if request.method == 'POST':
        php = request.json["file"]
        print(request)
        pattern = r"\"(SELECT|INSERT|UPDATE|DELETE)(.*?)\""
        queries = [i + j for i, j in re.findall(pattern, php, re.DOTALL)]
        print("Performing basic check for variables:")
        vulnerable = []
        for q in queries:
            tokens = RETokenizer(q)
            variables = [token for token in tokens if token.startswith("$")]
            
            print(q)
            if len(variables) > 0:
                vulnerable.append((q, variables))
                print("Maybe vulnerable\n")
            else:
                vulnerable.append((q, []))
                print("Not vulnerable directly\n")
        corrections = []
        for v in vulnerable:
            if len(v[1]) > 0:
                corrections.append(correction(v[0]))
            else:
                corrections.append([])
        return {"vulnerable": vulnerable, "corrections": corrections}