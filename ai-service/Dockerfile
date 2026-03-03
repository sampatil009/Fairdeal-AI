FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .

# Install dependencies, including matching spaCy model
RUN pip install --no-cache-dir -r requirements.txt
# RUN python -m spacy download en_core_web_sm -q

COPY . .
EXPOSE 5001
CMD ["python", "run.py"]
