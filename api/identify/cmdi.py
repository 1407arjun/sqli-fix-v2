import re
from tokenizer import RETokenizer

def find_cmdi_vars(cmd):
    tokens = RETokenizer(cmd, r'\$?\w+')
    tokens = [token for token in tokens if not (token.startswith("$_GET") or token.startswith("$_POST") or token.startswith("$_SESSION") or token.startswith("$_COOKIE"))]
    tokens += RETokenizer(cmd, r'\$_GET\[\'?\w+\'\]')
    tokens += RETokenizer(cmd, r'\$_POST\[\'?\w+\'\]')
    tokens += RETokenizer(cmd, r'\$_SESSION\[\'?\w+\'\]')
    tokens += RETokenizer(cmd, r'\$_COOKIE\[\'?\w+\'\]')
    variables = [token for token in tokens if token.startswith("$")]
    return tokens, variables


def identify_cmdi(php):
    pattern = r"(include|exec|passthru|system)\((.*?)\)"
    cmds = [i + j for i, j in re.findall(pattern, php, re.DOTALL)]
    print("Performing basic check for variables:")
    vulnerable = []
    for cmd in cmds:
        tokens, variables = find_cmdi_vars(cmd)
        
        print(cmd)
        if len(variables) > 0:
            vulnerable.append((cmd, variables))
            print("Maybe vulnerable\n")
        else:
            vulnerable.append((cmd, []))
            print("Not vulnerable directly\n")
    return vulnerable