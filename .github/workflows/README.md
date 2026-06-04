# ExplorePi - JSON Data Management System

## 📋 Overview

A comprehensive Python-based system for managing, validating, processing, and synchronizing JSON data with integrated CI/CD workflows, API services, and database operations.

## 🚀 Features

- **JSON Validation & Schema Management** - Validate JSON files against custom schemas
- **Data Processing Pipeline** - Automated data transformation and aggregation
- **REST API Service** - FastAPI-based API for JSON operations
- **Database Synchronization** - Sync JSON data with PostgreSQL
- **GitHub Actions Workflows** - Automated CI/CD pipelines
- **Backup & Recovery** - Automated backup system with versioning
- **Data Analytics** - Statistics and reporting capabilities

## 📁 Project Structure

```
ExplorePi/
├── .github/
│   └── workflows/
│       ├── python-ci-cd.yml           # Main CI/CD workflow
│       └── json-sync-workflow.yml     # Data synchronization workflow
├── data/                              # JSON data files
│   ├── users.json
│   ├── products.json
│   └── config.json
├── schemas/                           # JSON schema definitions
│   ├── user_schema.json
│   ├── product_schema.json
│   └── config_schema.json
├── backups/                          # Backup archives
├── processed/                        # Processed data outputs
├── reports/                          # Generated reports
├── json_processor.py                 # Core JSON processing library
├── schema_validator.py               # Schema validation utilities
├── json_api.py                       # REST API service
└── requirements.txt                  # Python dependencies
```

## 🔧 Installation

### Prerequisites

- Python 3.9 or higher
- PostgreSQL 15+ (for database features)
- Git
- pip

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/arifinahmad99-cloud/ExplorePi.git
cd ExplorePi
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

## 📚 Usage

### JSON Processor

Process and validate JSON files:

```python
from json_processor import JSONDataProcessor

# Initialize processor
processor = JSONDataProcessor(data_dir="data")

# Validate all JSON files
results = processor.validate_all_files()
print(f"Valid files: {results['valid_files']}/{results['total_files']}")

# Read JSON file
data = processor.read_json("users.json")

# Write JSON file
processor.write_json("output.json", {"key": "value"})

# Merge multiple files
processor.merge_json_files("merged.json", "*.json")

# Get statistics
stats = processor.get_statistics()
print(f"Total files: {stats['total_files']}")
print(f"Total size: {stats['total_size_mb']} MB")
```

### Schema Validator

Validate JSON data against schemas:

```python
from schema_validator import JSONSchemaValidator

# Initialize validator
validator = JSONSchemaValidator(schema_dir="schemas")

# Validate data
data = {"id": 1, "username": "john", "email": "john@example.com"}
is_valid, error = validator.validate_data(data, "user_schema")

if is_valid:
    print("✓ Data is valid")
else:
    print(f"✗ Validation error: {error}")

# Create new schema
user_schema = {
    "type": "object",
    "required": ["id", "username", "email"],
    "properties": {
        "id": {"type": "integer"},
        "username": {"type": "string"},
        "email": {"type": "string", "format": "email"}
    }
}
validator.create_schema("user_schema", user_schema)
```

### REST API Service

Start the API server:

```bash
python json_api.py
```

Or with uvicorn:

```bash
uvicorn json_api:app --reload --host 0.0.0.0 --port 8000
```

**API Endpoints:**

```bash
# List all files
GET http://localhost:8000/files

# Get specific file
GET http://localhost:8000/files/users.json

# Create new file
POST http://localhost:8000/files
{
  "filename": "new_data.json",
  "data": {"key": "value"}
}

# Update file
PUT http://localhost:8000/files/users.json
{
  "id": 1,
  "username": "updated"
}

# Delete file
DELETE http://localhost:8000/files/old_data.json

# Upload file
POST http://localhost:8000/upload
# (multipart/form-data with file)

# Validate data
POST http://localhost:8000/validate
{
  "data": {"test": "data"},
  "schema_name": "user_schema"
}

# Transform data
POST http://localhost:8000/transform
{
  "input_filename": "input.json",
  "output_filename": "output.json",
  "operation": "filter",
  "parameters": {
    "key": "status",
    "value": "active"
  }
}

# Get statistics
GET http://localhost:8000/stats

# Search data
GET http://localhost:8000/search?query=john&field=username

# Health check
GET http://localhost:8000/health
```

### Command Line Interface

Quick validation and processing:

```bash
# Validate all JSON files
python json_processor.py

# Validate with schemas
python schema_validator.py

# Create example data and schemas
python schema_validator.py
```

## 🔄 GitHub Actions Workflows

### Python CI/CD Workflow

Automatically runs on push and pull requests:

**Jobs:**
1. **Code Quality** - Linting with flake8, black, isort, mypy
2. **JSON Validation** - Validates all JSON files
3. **Testing** - Runs pytest on Python 3.9-3.12
4. **Data Processing** - Processes JSON files
5. **Database Operations** - Syncs with PostgreSQL
6. **Build & Deploy** - Creates deployment packages
7. **Security Scan** - Runs bandit and safety checks

### JSON Synchronization Workflow

Scheduled daily at midnight UTC:

**Jobs:**
1. **Validate JSON** - Validates all data files
2. **Backup Data** - Creates timestamped backups
3. **Process Data** - Transforms and aggregates data
4. **Generate Reports** - Creates HTML/JSON reports
5. **Database Sync** - Syncs to PostgreSQL (optional)
6. **Notification** - Summary of results

**Manual Trigger:**
```bash
# Go to Actions tab in GitHub
# Select "JSON Data Synchronization"
# Click "Run workflow"
# Choose sync type: full, incremental, or validate_only
```

## 🗄️ Database Integration

### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE json_data;

-- Tables are auto-created by workflows
-- json_records: Stores JSON data
-- sync_history: Tracks synchronization history
```

### Sync Data to Database

```python
from json_processor import JSONDatabaseSync

# Initialize sync
db_sync = JSONDatabaseSync(database_url="postgresql://user:pass@localhost/json_data")

# Sync to database
data = {"id": 1, "name": "Example"}
db_sync.sync_to_database(data, table_name="json_records")

# Export from database
db_sync.export_from_database("json_records", "exported.json")
```

## 📊 Data Transformations

### Available Operations

1. **Filter** - Filter data by field values
```python
request = TransformRequest(
    input_filename="users.json",
    output_filename="active_users.json",
    operation="filter",
    parameters={"key": "active", "value": True}
)
```

2. **Map** - Rename/transform fields
```python
request = TransformRequest(
    input_filename="users.json",
    output_filename="transformed.json",
    operation="map",
    parameters={"field_map": {"old_name": "new_name"}}
)
```

3. **Sort** - Sort list data
```python
request = TransformRequest(
    input_filename="users.json",
    output_filename="sorted.json",
    operation="sort",
    parameters={"key": "created_at", "reverse": True}
)
```

## 🔐 Security

- **Dependency Scanning** - Automated with Safety
- **Code Analysis** - Bandit for security issues
- **Secret Management** - Use GitHub Secrets for credentials
- **Input Validation** - All API endpoints validate input
- **SQL Injection Protection** - Parameterized queries only

## 📈 Monitoring & Logging

### Logging Configuration

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

### Metrics & Reports

- **Validation Reports** - JSON validation results
- **Processing Reports** - Data transformation statistics
- **Sync History** - Database synchronization logs
- **API Metrics** - Request/response logs

## 🧪 Testing

Run tests:

```bash
# All tests
pytest

# With coverage
pytest --cov=. --cov-report=html

# Specific test file
pytest tests/test_processor.py

# Verbose mode
pytest -v
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI framework
- PostgreSQL database
- GitHub Actions
- Python community

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Version:** 2.0.0  
**Last Updated:** February 2026
