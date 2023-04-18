import re
from tokenizer import RETokenizer

def find_xss_vars(php):
    tokens = RETokenizer(php, r'\$_GET\[\'?\w+\'\]')
    tokens += RETokenizer(php, r'\$_POST\[\'?\w+\'\]')
    tokens += RETokenizer(php, r'\$_SESSION\[\'?\w+\'\]')
    tokens += RETokenizer(php, r'\$_COOKIE\[\'?\w+\'\]')
    variables = [token for token in tokens if token.startswith("$_GET") or token.startswith("$_POST") or token.startswith("$_SESSION") or token.startswith("$_COOKIE")]
    return variables

def identify_xss(php):
    print("Performing basic check for variables:")

    # Check for SQL based XSS
    pattern = r"\"(SELECT|INSERT|UPDATE|DELETE)(.*?)\""
    queries = [i + j for i, j in re.findall(pattern, php, re.DOTALL)]
    if len(queries) > 0:
        for q in queries:
            tokens = RETokenizer(q, r'\$?\w+')
            variables = [token for token in tokens if token.startswith("$")]
            
            print(q)
            if len(variables) > 0:
                print("Maybe vulnerable\n")
                return [q, variables, 0]

    # Check for reflected XSS
    variables = find_xss_vars(php)
    
    print(php)
    if len(variables) > 0:
        print("Maybe vulnerable\n")
        return [php, variables, 1]
    
    # Check for Stored XSS
    if "fetch_assoc()" in php:
        print("Maybe vulnerable\n")
        return [php, [], 2]
    
    print("Not vulnerable directly\n")
    return [php, [], -1]