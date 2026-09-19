import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.cascade import calculate_cascade
from services.risk import calculate_risk_score
from services.ai import analyze_incident_image, generate_response_plan
from pydantic import BaseModel

app = FastAPI(title="CascadeZero API")

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent.parent / "data"

def load_json(filename: str):
    file_path = DATA_DIR / filename
    if file_path.exists():
        with open(file_path, "r") as f:
            return json.load(f)
    return []

def get_all_infrastructure():
    return {
        "hospitals": load_json("hospitals.json"),
        "power_nodes": load_json("power_nodes.json"),
        "water_plants": load_json("water_plants.json"),
        "roads": load_json("roads.json")
    }

@app.get("/")
def read_root():
    return {"message": "CascadeZero Backend Running"}

@app.get("/api/infrastructure")
def get_infrastructure_api():
    """Returns all mock infrastructure data for the map."""
    return get_all_infrastructure()

@app.get("/api/graph")
def get_graph():
    """Returns the adjacency list of dependencies."""
    return load_json("graph.json")

class SimulationRequest(BaseModel):
    node_id: str
    severity: int = 30  # Default severity

@app.post("/api/simulate")
def simulate_failure(request: SimulationRequest):
    """Simulates the cascade effect if a specific node fails."""
    graph = load_json("graph.json")
    infrastructure = get_all_infrastructure()
    
    affected = calculate_cascade(request.node_id, graph)
    risk_assessment = calculate_risk_score(request.severity, list(affected), graph, infrastructure)
    
    return {
        "failed_node": request.node_id,
        "affected_nodes": list(affected),
        "total_affected": len(affected),
        "risk_assessment": risk_assessment
    }

@app.post("/api/analyze-incident")
def analyze_incident():
    """Simulates uploading an image and getting AI Vision results."""
    # In a real app, this would receive a file upload
    result = analyze_incident_image()
    return result

class ResponsePlanRequest(BaseModel):
    incident: dict
    cascade: dict

@app.post("/api/generate-plan")
def get_response_plan(request: ResponsePlanRequest):
    """Generates an AI response plan based on the cascade results."""
    plan = generate_response_plan(request.incident, request.cascade)
    return {"plan": plan}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
