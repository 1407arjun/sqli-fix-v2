import re
from tokenizer import RETokenizer

def identify_sqli(php):
    pattern = r"\"(SELECT|INSERT|UPDATE|DELETE)(.*?)\""
    queries = [i + j for i, j in re.findall(pattern, php, re.DOTALL)]
    print("Performing basic check for variables:")
    vulnerable = []
    for q in queries:
        tokens = RETokenizer(q, r'\$?\w+')
        variables = [token for token in tokens if token.startswith("$")]
        
        print(q)
        if len(variables) > 0:
            vulnerable.append((q, variables))
            print("Maybe vulnerable\n")
        else:
            vulnerable.append((q, []))
            print("Not vulnerable directly\n")
    return vulnerable