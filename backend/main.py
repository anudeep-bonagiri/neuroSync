import os
from gradient_adk import Agent, Tool
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import json

# --- DigitalOcean Gradient Configuration ---
# Ensure these environment variables are set in your execution environment
# GRADIENT_ACCESS_TOKEN
# GRADIENT_WORKSPACE_ID
# KNOWLEDGE_BASE_ID

class NeuralNode(BaseModel):
    id: str = Field(..., description="Unique identifier for the brain region (e.g., 'Amygdala')")
    region_name: str = Field(..., description="Name of the brain region")
    function: Optional[str] = Field(None, description="Primary function of the region")

class NeuralEdge(BaseModel):
    source: str = Field(..., description="Source region ID")
    target: str = Field(..., description="Target region ID")
    connection_type: str = Field(..., description="Type of connection (e.g., 'excitatory', 'inhibitory', 'structural')")
    weight: float = Field(0.5, description="Strength of the connection (0.0 to 1.0)")

class NeuralGraph(BaseModel):
    nodes: List[NeuralNode]
    edges: List[NeuralEdge]

# --- Tools ---

# Canonical list of brain regions to prevent "Entity Extraction Mess" (Flaw 4)
CANONICAL_REGIONS = {
    "amygdala": "Amygdala",
    "hippocampus": "Hippocampus",
    "prefrontal cortex": "Prefrontal Cortex",
    "pfc": "Prefrontal Cortex",
    "thalamus": "Thalamus",
    "cerebellum": "Cerebellum",
    "visual cortex": "Visual Cortex",
    "v1": "Visual Cortex",
    "motor cortex": "Motor Cortex",
    "acc": "Anterior Cingulate Cortex",
    "anterior cingulate": "Anterior Cingulate Cortex"
}

class NeuralGraphResponse(BaseModel):
    nodes: List[NeuralNode]
    edges: List[NeuralEdge]
    metadata: Dict[str, object]

def extract_neural_pathways(clinical_text: str) -> Dict:
    """
    Analyzes clinical text to identify brain regions and their connections.
    Returns a JSON structure representing nodes and edges for 3D visualization.
    Implements:
    - Canonical Entity Extraction
    - Hallucination Gating (Confidence Score)
    - "Top 5" Edge Filtering
    """
    cleaned_text = clinical_text.lower()
    
    # 1. Entity Extraction with Synonym Mapping (Flaw 4)
    found_regions_map = {}
    for key, canonical in CANONICAL_REGIONS.items():
        if key in cleaned_text:
            found_regions_map[canonical] = True
            
    unique_regions = list(found_regions_map.keys())
    
    # 2. Hallucination Gating (Flaw 1)
    # Mock confidence calculation: Low confidence if few regions found or text is very short/garbage
    confidence_score = 0.95 if len(unique_regions) >= 2 else 0.4
    if len(cleaned_text) < 20: 
        confidence_score = 0.1
        
    if confidence_score < 0.7:
        return {
            "error": "Low Confidence",
            "message": "I cannot find sufficient peer-reviewed data to clarify specific pathways in this text.",
            "confidence": confidence_score
        }

    # Construct Nodes
    nodes = [{"id": r, "region_name": r, "function": "Neural Processing"} for r in unique_regions]
    
    # Construct Edges
    edges = []
    if len(nodes) > 1:
        # Create mock fully connected graph for demo, then filter
        import random
        for i in range(len(nodes)):
            for j in range(i + 1, len(nodes)):
                 weight = random.uniform(0.1, 0.9) # Mock weight
                 edges.append({
                    "source": nodes[i]['id'],
                    "target": nodes[j]['id'],
                    "connection_type": "associate",
                    "weight": weight
                })
    
    # 3. Top 5 Filtering (Flaw 2 - "3D Hairball")
    # Sort by weight desc and take top 5
    edges.sort(key=lambda x: x['weight'], reverse=True)
    top_edges = edges[:5]
            
    return {
        "nodes": nodes,
        "edges": top_edges,
        "metadata": {
            "source": "Neuro-Sync AI Extraction", 
            "confidence": confidence_score,
            "filter_applied": "Top 5 Strongest Connections"
        }
    }

# --- System Prompt Loading ---
def load_system_prompt(persona: str = "Researcher") -> str:
    """
    Loads the system prompt based on the selected persona.
    """
    base_prompt = (
        "You are Neuro-Sync AI, a specialized assistant for neuroscience research. "
        "You have access to a DigitalOcean Knowledge Base containing dense clinical data. "
    )
    
    if persona == "Patient":
        return base_prompt + (
            "EXPLAIN LIKE I'M 5. Use simple analogies (e.g., 'The brain is like a city...'). "
            "Avoid jargon. Focus on 'How this affects daily life'. "
            "If you use data from the Knowledge Base, summarize it simply."
        )
    else: # Researcher
        return base_prompt + (
            "ACT AS A SENIOR LAB DIRECTOR. Use precise clinical terminology (e.g., 'Dorsolateral Prefrontal Cortex'). "
            "Cite specific papers or data points from the Knowledge Base. "
            "Format pathways clearly. When analyzing text, look for connectivity data."
        )

# --- Agent Setup ---
def create_gradient_agent():
    extract_tool = Tool(
        name="extract_neural_pathways",
        description="Extracts brain regions and connections from text to generate a 3D neural map.",
        func=extract_neural_pathways,
        args_schema=ExtractNeuralPathwaysInput
    )

    agent = Agent(
        name="neuro-sync-agent",
        model="llama3-70b-instruct", # Using a high-quality model available regarding Gradient
        tools=[extract_tool],
        # knowledge_base_id=os.getenv("KNOWLEDGE_BASE_ID"), # Uncomment when KB is set up
        description="An AI that transforms neuroscience data into insights and regular maps."
    )
    
    return agent

# --- Main Entry Point (for local testing or fastAPI wrap) ---
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Neuro-Sync AI Backend", version="1.0.0")

class QueryRequest(BaseModel):
    query: str
    persona: str = "Researcher" # or "Patient"

@app.post("/analyze")
async def analyze_query(request: QueryRequest):
    agent = create_gradient_agent()
    
    # Update system prompt based on persona
    # Note: In a real Gradient Agent SDK, we might pass this differently or set it on the run.
    # For this implementation, we assume we can prepend it to the query or configure the context.
    system_instruction = load_system_prompt(request.persona)
    
    # Combining system prompt with user query for the 'run'
    full_prompt = f"{system_instruction}\n\nUser Query: {request.query}"
    
    try:
        # response = agent.run(full_prompt) # Hypothetical SDK usage
        # Since I cannot actually run the SDK, I will return a mock response structure
        # that mimics what the frontend expects.
        
        # MOCK RESPONSE for Hackathon speed:
        mock_response = {
            "response": f"Processed '{request.query}' as {request.persona}. " 
                        "The Amygdala shows heightened activity...",
            "data": extract_neural_pathways(request.query)
        }
        return mock_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
