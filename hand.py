import os, sys
from openai import OpenAI
from playwright.sync_api import sync_playwright

url = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto(url, timeout=30000)
    text = page.inner_text("body")[:6000]
    b.close()

client = OpenAI(base_url="https://api.groq.com/openai/v1",
                api_key=os.environ["GROQ_API_KEY"].strip())
r = client.chat.completions.create(
    model="openai/gpt-oss-120b",
    messages=[
        {"role": "system", "content": "لخص الصفحة دي بالمصري في 5 نقط بسيطة."},
        {"role": "user", "content": text},
    ],
)
print(r.choices[0].message.content)
