from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json, openai, os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

with open("backend/data/getfarms_properties.json") as f:
    PROPERTIES = json.load(f)

@app.get("/")
def read_root():
    return {"message": "Smart Property Match API is running."}

@app.post("/match-properties-ai")
async def match_properties_ai(req: Request):
    user_input = await req.json()
    location = user_input.get("location", "")
    budget = user_input.get("budget", "")
    property_type = user_input.get("property_type", "")

    prompt = f"""
    You are an AI assistant. Match user needs with property listings.
    User:
    - Location: {location}
    - Budget: ₹{budget}
    - Property Type: {property_type}
    Listings:
    {json.dumps(PROPERTIES, indent=2)}
    Return top 3 matches as a JSON array of property IDs only.
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )

    try:
        ids = json.loads(response['choices'][0]['message']['content'])
        matched = [p for p in PROPERTIES if p["id"] in ids]
        return matched
    except Exception as e:
        return {"error": str(e)}