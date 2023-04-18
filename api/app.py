from flask import Flask, request
from flask_cors import CORS

from routes import sqli, xss

app = Flask(__name__)
CORS(app, support_credentials=True)

app.register_blueprint(sqli.bp)
app.register_blueprint(xss.bp)
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)