#!/usr/bin/env python3
"""
JSON Data API Service
FastAPI-based REST API for JSON data operations
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from pathlib import Path
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="JSON Data API",
    description="RESTful API for JSON data management and operations",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data directory
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

# Pydantic models
class JSONDataModel(BaseModel):
    """Model for JSON data"""
    filename: str = Field(..., description="Name of the JSON file")
    data: Dict[str, Any] | List[Any] = Field(..., description="JSON data content")

class ValidationRequest(BaseModel):
    """Model for validation request"""
    data: Dict[str, Any] | List[Any] = Field(..., description="Data to validate")
    schema_name: Optional[str] = Field(None, description="Schema name for validation")

class TransformRequest(BaseModel):
    """Model for data transformation request"""
    input_filename: str = Field(..., description="Input file name")
    output_filename: str = Field(..., description="Output file name")
    operation: str = Field(..., description="Transformation operation")
    parameters: Optional[Dict[str, Any]] = Field(default={}, description="Operation parameters")

class APIResponse(BaseModel):
    """Standard API response model"""
    status: str = Field(..., description="Response status")
    message: str = Field(..., description="Response message")
    data: Optional[Dict[str, Any]] = Field(None, description="Response data")
    timestamp: datetime = Field(default_factory=datetime.now)


# Utility functions
def read_json_file(filename: str) -> Dict | List:
    """Read JSON file from data directory"""
    filepath = DATA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail=f"File {filename} not found")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON in file: {str(e)}")

def write_json_file(filename: str, data: Dict | List) -> None:
    """Write JSON file to data directory"""
    filepath = DATA_DIR / filename
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error writing file: {str(e)}")


# API Routes
@app.get("/", response_model=APIResponse)
async def root():
    """Root endpoint - API information"""
    return APIResponse(
        status="success",
        message="JSON Data API is running",
        data={
            "version": "2.0.0",
            "endpoints": {
                "GET /files": "List all JSON files",
                "GET /files/{filename}": "Get specific file content",
                "POST /files": "Create new JSON file",
                "PUT /files/{filename}": "Update existing file",
                "DELETE /files/{filename}": "Delete file",
                "POST /validate": "Validate JSON data",
                "POST /transform": "Transform JSON data",
                "GET /stats": "Get statistics"
            }
        }
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/files", response_model=APIResponse)
async def list_files():
    """List all JSON files in data directory"""
    try:
        files = []
        for filepath in DATA_DIR.glob("*.json"):
            stat = filepath.stat()
            files.append({
                "filename": filepath.name,
                "size_bytes": stat.st_size,
                "size_kb": round(stat.st_size / 1024, 2),
                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat()
            })
        
        return APIResponse(
            status="success",
            message=f"Found {len(files)} JSON files",
            data={"files": files, "total": len(files)}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/files/{filename}")
async def get_file(filename: str):
    """Get content of a specific JSON file"""
    try:
        data = read_json_file(filename)
        return JSONResponse(content=data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/files", response_model=APIResponse)
async def create_file(json_data: JSONDataModel):
    """Create a new JSON file"""
    try:
        filepath = DATA_DIR / json_data.filename
        if filepath.exists():
            raise HTTPException(status_code=409, detail="File already exists")
        
        write_json_file(json_data.filename, json_data.data)
        
        return APIResponse(
            status="success",
            message=f"File {json_data.filename} created successfully",
            data={"filename": json_data.filename}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/files/{filename}", response_model=APIResponse)
async def update_file(filename: str, json_data: Dict | List):
    """Update an existing JSON file"""
    try:
        filepath = DATA_DIR / filename
        if not filepath.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        write_json_file(filename, json_data)
        
        return APIResponse(
            status="success",
            message=f"File {filename} updated successfully",
            data={"filename": filename}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/files/{filename}", response_model=APIResponse)
async def delete_file(filename: str):
    """Delete a JSON file"""
    try:
        filepath = DATA_DIR / filename
        if not filepath.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        filepath.unlink()
        
        return APIResponse(
            status="success",
            message=f"File {filename} deleted successfully",
            data={"filename": filename}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a JSON file"""
    if not file.filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="Only JSON files are allowed")
    
    try:
        content = await file.read()
        data = json.loads(content.decode('utf-8'))
        
        write_json_file(file.filename, data)
        
        return APIResponse(
            status="success",
            message=f"File {file.filename} uploaded successfully",
            data={"filename": file.filename, "size": len(content)}
        )
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate", response_model=APIResponse)
async def validate_data(request: ValidationRequest):
    """Validate JSON data"""
    try:
        # Basic validation (data is already parsed if we get here)
        is_valid = True
        message = "Data is valid JSON"
        
        # Additional validation logic can be added here
        # For example, schema validation if schema_name is provided
        
        return APIResponse(
            status="success" if is_valid else "error",
            message=message,
            data={
                "valid": is_valid,
                "data_type": type(request.data).__name__,
                "schema": request.schema_name
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transform", response_model=APIResponse)
async def transform_data(request: TransformRequest):
    """Transform JSON data"""
    try:
        input_data = read_json_file(request.input_filename)
        
        # Perform transformation based on operation
        transformed_data = None
        
        if request.operation == "filter":
            # Filter data based on parameters
            key = request.parameters.get("key")
            value = request.parameters.get("value")
            if isinstance(input_data, list):
                transformed_data = [item for item in input_data if item.get(key) == value]
            else:
                transformed_data = input_data
        
        elif request.operation == "map":
            # Map/transform fields
            field_map = request.parameters.get("field_map", {})
            if isinstance(input_data, list):
                transformed_data = [
                    {field_map.get(k, k): v for k, v in item.items()}
                    for item in input_data
                ]
            else:
                transformed_data = {field_map.get(k, k): v for k, v in input_data.items()}
        
        elif request.operation == "sort":
            # Sort list data
            if isinstance(input_data, list):
                sort_key = request.parameters.get("key")
                reverse = request.parameters.get("reverse", False)
                transformed_data = sorted(input_data, key=lambda x: x.get(sort_key, ""), reverse=reverse)
            else:
                transformed_data = input_data
        
        else:
            raise HTTPException(status_code=400, detail=f"Unknown operation: {request.operation}")
        
        # Write transformed data
        write_json_file(request.output_filename, transformed_data)
        
        return APIResponse(
            status="success",
            message=f"Data transformed successfully",
            data={
                "input": request.input_filename,
                "output": request.output_filename,
                "operation": request.operation
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats", response_model=APIResponse)
async def get_statistics():
    """Get statistics about JSON files"""
    try:
        total_files = 0
        total_size = 0
        file_types = {}
        
        for filepath in DATA_DIR.glob("*.json"):
            total_files += 1
            total_size += filepath.stat().st_size
            
            # Categorize files
            category = filepath.stem.split('_')[0] if '_' in filepath.stem else 'other'
            file_types[category] = file_types.get(category, 0) + 1
        
        return APIResponse(
            status="success",
            message="Statistics retrieved successfully",
            data={
                "total_files": total_files,
                "total_size_bytes": total_size,
                "total_size_kb": round(total_size / 1024, 2),
                "total_size_mb": round(total_size / (1024 * 1024), 2),
                "file_categories": file_types
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search")
async def search_data(
    query: str = Query(..., description="Search query"),
    field: Optional[str] = Query(None, description="Field to search in")
):
    """Search across all JSON files"""
    try:
        results = []
        
        for filepath in DATA_DIR.glob("*.json"):
            try:
                data = read_json_file(filepath.name)
                
                # Simple search implementation
                if isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict):
                            if field:
                                if field in item and query.lower() in str(item[field]).lower():
                                    results.append({
                                        "file": filepath.name,
                                        "data": item
                                    })
                            else:
                                if any(query.lower() in str(v).lower() for v in item.values()):
                                    results.append({
                                        "file": filepath.name,
                                        "data": item
                                    })
                elif isinstance(data, dict):
                    if field:
                        if field in data and query.lower() in str(data[field]).lower():
                            results.append({
                                "file": filepath.name,
                                "data": data
                            })
                    else:
                        if any(query.lower() in str(v).lower() for v in data.values()):
                            results.append({
                                "file": filepath.name,
                                "data": data
                            })
            except:
                continue
        
        return JSONResponse(content={
            "query": query,
            "field": field,
            "results": results,
            "total": len(results)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
