def calculate_risk_score(incident_severity: int, affected_nodes: list, graph: dict, infrastructure_data: dict) -> dict:
    """
    Calculates the risk score based on the incident severity and cascading effects.
    """
    score = incident_severity
    
    # Analyze affected nodes
    criticality_score = 0
    dependency_score = len(affected_nodes) * 5  # 5 points per affected node
    
    # Flatten infrastructure data to easily lookup node types/priorities
    nodes_info = {}
    for category, nodes in infrastructure_data.items():
        for node in nodes:
            nodes_info[node['id']] = node
            
    for node_id in affected_nodes:
        node = nodes_info.get(node_id, {})
        priority = node.get("priority", "low")
        if priority == "critical":
            criticality_score += 30
        elif priority == "high":
            criticality_score += 20
        elif priority == "medium":
            criticality_score += 10
            
    # Cap criticality score to max 40
    criticality_score = min(criticality_score, 40)
    
    # Cap dependency score to max 30
    dependency_score = min(dependency_score, 30)
    
    total_score = score + criticality_score + dependency_score
    # Cap at 100
    total_score = min(total_score, 100)
    
    if total_score <= 30:
        level = "LOW"
    elif total_score <= 60:
        level = "MEDIUM"
    elif total_score <= 80:
        level = "HIGH"
    else:
        level = "CRITICAL"
        
    return {
        "score": total_score,
        "level": level,
        "breakdown": {
            "incident_severity": score,
            "criticality": criticality_score,
            "dependency": dependency_score
        }
    }
