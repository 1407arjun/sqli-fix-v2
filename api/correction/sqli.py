from tokenizer import RETokenizer

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

def correct_sqli(query):
    corrections = []
    tokens = RETokenizer(query, r'\$?\w+')
    corrections.append("Statement type " + tokens[0])

    variables = find_vars(tokens, query)
    pstmt = create_pstmt(query, variables)
    corrections.append(pstmt)
    
    for i, var in enumerate(variables):
        corrections.append("bind(" + var[0] + ", " + str(i) + ")")
    return corrections