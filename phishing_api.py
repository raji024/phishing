from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# ✅ Load model at startup
model = joblib.load('xgb_phishing_model.pkl')

@app.route('/')
def home():
    return "✅ Phishing Detection API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'features' not in data:
        return jsonify({"error": "Please provide 'features' in JSON."}), 400

    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)[0]

    result = "phishing" if prediction == 1 else "legitimate"
    return jsonify({"prediction": result})

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "This endpoint does not exist."}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
