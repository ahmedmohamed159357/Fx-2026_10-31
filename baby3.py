import os, json
from openai import OpenAI

client = OpenAI(base_url="https://api.groq.com/openai/v1",
                api_key=os.environ["GROQ_API_KEY"].strip())

FILE = "memory.json"
facts = json.load(open(FILE, encoding="utf-8")) if os.path.exists(FILE) else []
history = []

def system_prompt():
    known = "\n".join("- " + f for f in facts) or "(لسه مفيش حاجة)"
    return ("انت طفل ذكاء اصطناعي صغير بيتعلم من صاحبك. "
            "اتكلم بالمصري وبشكل بسيط ودود.\n"
            "صاحبك علمك الحاجات دي عن نفسه (لما يقول اسمي أو أنا يقصد نفسه هو مش انت):\n" + known)

while True:
    msg = input("انت: ").strip()
    if msg in ("خروج", "exit"):
        break
    if msg.startswith("تعلم:"):
        facts.append(msg[5:].strip())
        json.dump(facts, open(FILE, "w", encoding="utf-8"), ensure_ascii=False)
        print("بيبي: اتعلمت!")
        continue
    history.append({"role": "user", "content": msg})
    r = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "system", "content": system_prompt()}] + history[-10:],
    )
    reply = r.choices[0].message.content
    history.append({"role": "assistant", "content": reply})
    print("بيبي:", reply)
