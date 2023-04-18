from tokenizer import RETokenizer
from identify.cmdi import find_cmdi_vars

cmds = {"chmod": "chmod", "cp": "copy", "basename": "basename", "pwd": "dirname", "glob": "glob", "mkdir": "mkdir", "rmdir": "rmdir", "rm": "unlink", "ls": "scandir"}

def create_filter(type, cmd, variables):
    filter = cmd.replace(type, f'{type}(escapeshellcmd(', 1) + "))"
    for v in variables:
        filter = filter.replace(v, f'escapeshellarg({v})', 1)
    return filter

def correct_cmdi(cmd):
    corrections = []
    tokens, variables = find_cmdi_vars(cmd)
    corrections.append("Command type " + tokens[0])

    if tokens[0] == "include":
        corrections.append("Override to use filepath")
        corrections.append(f'include(basename(realpath({".".join(variables)})));')
    elif tokens[1] not in variables and tokens[1] in list(cmds.keys()):
        corrections.append("Use a built-in function instead:")
        corrections.append(f'{cmds[tokens[1]]}({",".join(variables)});')
    else:
        filter = create_filter(tokens[0], cmd, variables)
        corrections.append(filter)
    return corrections