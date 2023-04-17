from nltk.tokenize import RegexpTokenizer

def RETokenizer(query, pattern):
    tokenizer = RegexpTokenizer(pattern)
    tokens = tokenizer.tokenize(query)
    return tokens

