import random

def analyze_incident_image(image_bytes: bytes = None) -> dict:
    """
    Mock AI Vision analysis that simulates detecting an incident from an image.
    For a hackathon MVP, we return a predefined payload to guarantee a flawless demo.
    """
    scenarios = [
        {
            "incident_type": "flooded_road",
            "confidence": 0.94,
            "severity": 40,
            "affected_infrastructure": ["road_01"],
            "description": "Severe waterlogging blocking approximately 70% of the road."
        },
        {
            "incident_type": "power_failure",
            "confidence": 0.98,
            "severity": 80,
            "affected_infrastructure": ["power_01"],
            "description": "Explosion at the main substation causing complete failure."
        }
    ]
    
    return random.choice(scenarios)

def generate_response_plan(incident: dict, cascade: dict) -> str:
    """
    Mock LLM generating an emergency response plan based on the incident and cascade.
    """
    if incident.get("incident_type") == "power_failure":
        return """EMERGENCY RESPONSE PLAN
        
Priority 1
Deploy generator to City Hospital A.

Priority 2
Redirect ambulance traffic through Road C.

Priority 3
Dispatch maintenance team to Main Substation.

Priority 4
Activate emergency traffic control at Junction B."""

    return """EMERGENCY RESPONSE PLAN
    
Priority 1
Deploy water pumps to Road A.

Priority 2
Redirect traffic away from the flooded area.

Priority 3
Notify City Hospital A of potential ambulance delays."""
