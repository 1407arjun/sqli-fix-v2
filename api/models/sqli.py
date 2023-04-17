from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
import pandas as pd

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