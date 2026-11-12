import os, json, urllib.request

req = urllib.request.Request(
    "https://api.groq.com/openai/v1/chat/completions",
    data=json.dumps({
        "model": "openai/gpt-oss-120b",
        "messages": [{"role": "user", "content": "قول لي مرحبا بالمصري"}],
    }).encode(),
    headers={
        "Authorization": "Bearer " + os.environ["GROQ_API_KEY"],
        "Content-Type": "application/json",
    },
)
r = json.load(urllib.request.urlopen(req))
print(r["choices"][0]["message"]["content"])
