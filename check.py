from os import environ
from google.cloud import speech

environ["GOOGLE_APPLICATION_CREDENTIALS"] = "google-credentials.json"
speech_client = speech.SpeechClient()

with open("commands/check.mp3", 'rb') as f:
    byte_data = f.read()
audio = speech.RecognitionAudio(content=byte_data)


config = {
    "sample_rate_hertz": 16000,
    "language_code": "en-US",
    "speech_contexts": [{"phrases": ["p o w - r"], "boost":10.0}]
}

response = speech_client.recognize(config=config, audio=audio)

print("Transcript : ")
for result in response.results:
    print(result.alternatives[0].transcript)
