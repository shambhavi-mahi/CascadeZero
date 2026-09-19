from typing import List, Dict, Set

def calculate_cascade(start_node_id: str, adjacency_list: Dict[str, List[str]]) -> Set[str]:
    """
    Given a failing node and the city's infrastructure graph, returns all nodes 
    that will be affected via cascading failure using BFS.
    """
    if start_node_id not in adjacency_list and not any(start_node_id in deps for deps in adjacency_list.values()):
        return {start_node_id} # Only affects itself if not connected

    affected_nodes = set()
    queue = [start_node_id]
    
    while queue:
        current = queue.pop(0)
        if current not in affected_nodes:
            affected_nodes.add(current)
            
            # Find dependencies of the current node
            # In our adjacency list A -> B means A failure causes B failure
            if current in adjacency_list:
                for dependent_node in adjacency_list[current]:
                    if dependent_node not in affected_nodes:
                        queue.append(dependent_node)
                        
    return affected_nodes
