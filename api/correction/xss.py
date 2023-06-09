from tokenizer import RETokenizer
from identify.xss import find_xss_vars

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

def create_encode(php, variables):
    encode = php
    for variable in variables:
        encode = encode.replace(variable, f"htmlspecialchars({variable}, ENT_QUOTES , 'UTF-8')", 1)
    return encode

def correct_xss(php, type):
    corrections = []
    if type == 0:
        tokens = RETokenizer(php, r'\$?\w+')
        corrections.append("XSS via SQL injection")
        variables = find_vars(tokens, php)
        pstmt = create_pstmt(php, variables)
        corrections.append(pstmt)
    
        for i, var in enumerate(variables):
            corrections.append("bind(" + var[0] + ", " + str(i) + ")")
    elif type == 1:
        variables = find_xss_vars(php)
        corrections.append("Reflected XSS")
        corrections.append(create_encode(php, variables))
    elif type == 2:
        corrections.append("Stored XSS")
        corrections.append("Possibility of data having XSS, sanitize during traversal")

    return corrections