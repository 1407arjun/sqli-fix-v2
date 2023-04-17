from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, precision_score, recall_score
import pandas as pd

df = pd.read_csv("./data/sqli/sqli.csv", encoding='utf-16')
df['Sentence'] = df['Sentence'].apply(lambda x: str(x).lower())
vectorizer = CountVectorizer(analyzer='word', ngram_range=(1, 2))
X = vectorizer.fit_transform(df['Sentence'].values.astype('U')).toarray()
y = df['Label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
nb_clf = GaussianNB()
nb_clf.fit(X_train, y_train)

def predict(ip):
    #injected_query = query.replace(variable, ip)
    features = vectorizer.transform([ip]).toarray()
    return nb_clf.predict(features)[0]

def accuracy():
    y_pred = nb_clf.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Precision:", precision_score(y_test, y_pred))
    print("Recall:", recall_score(y_test, y_pred))