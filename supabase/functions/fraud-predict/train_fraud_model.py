import pandas as pd
import xgboost as xgb
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, roc_auc_score

# Load dataset
df = pd.read_csv("transactions.csv")

# Convert fraud_status → numeric label
df["fraud_label"] = df["fraud_status"].apply(lambda x: 1 if x == "fraud" else 0)

# Encode categorical columns
categorical_cols = ["location", "device_type", "transaction_type", "merchant_category"]

encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Features
X = df[["amount", "location", "device_type", "transaction_type", "merchant_category"]]
y = df["fraud_label"]

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# XGBoost Model
model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    eval_metric="logloss",
    use_label_encoder=False
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, y_prob))

# Save model + encoders
joblib.dump(model, "fraud_model.pkl")
joblib.dump(encoders, "encoders.pkl")

print("Model saved successfully.")