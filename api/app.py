from flask import Flask, request
from flask_cors import CORS, cross_origin
import re
import pandas as pd
from nltk.tokenize import RegexpTokenizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB

app = Flask(__name__)
CORS(app, support_credentials=True)

df = pd.read_csv("./data/sqli.csv", encoding='utf-16')
df['Sentence'] = df['Sentence'].apply(lambda x: str(x).lower())
vectorizer = CountVectorizer(analyzer='word', ngram_range=(1, 2))
X = vectorizer.fit_transform(df['Sentence'].values.astype('U')).toarray()
y = df['Label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
nb_clf = GaussianNB()
nb_clf.fit(X_train, y_train)

def predict(query, variable, ip):
    injected_query = query.replace(variable, ip)
    features = vectorizer.transform([injected_query]).toarray()
    return nb_clf.predict(features)[0]


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

@app.route("/query", methods=["POST"])
@cross_origin(supports_credentials=True)
def query():
    if request.method == 'POST':
        php = request.json["file"]
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