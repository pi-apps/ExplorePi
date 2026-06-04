#!/usr/bin/env python3
"""
JSON Data Processor and Validator
Handles JSON file operations, validation, and data transformation
"""

import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class JSONDataProcessor:
    """Handles JSON data processing and validation"""
    
    def __init__(self, data_dir: str = "data"):
        """
        Initialize JSON Data Processor
        
        Args:
            data_dir: Directory containing JSON files
        """
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        
    def validate_json_file(self, filepath: Union[str, Path]) -> bool:
        """
        Validate a JSON file
        
        Args:
            filepath: Path to JSON file
            
        Returns:
            True if valid, False otherwise
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                json.load(f)
            logger.info(f"✓ Valid JSON: {filepath}")
            return True
        except json.JSONDecodeError as e:
            logger.error(f"✗ Invalid JSON in {filepath}: {e}")
            return False
        except Exception as e:
            logger.error(f"✗ Error reading {filepath}: {e}")
            return False
    
    def validate_all_files(self) -> Dict[str, Any]:
        """
        Validate all JSON files in the data directory
        
        Returns:
            Dictionary with validation results
        """
        results = {
            'total_files': 0,
            'valid_files': 0,
            'invalid_files': 0,
            'errors': []
        }
        
        for json_file in self.data_dir.rglob('*.json'):
            results['total_files'] += 1
            if self.validate_json_file(json_file):
                results['valid_files'] += 1
            else:
                results['invalid_files'] += 1
                results['errors'].append(str(json_file))
        
        logger.info(f"Validation complete: {results['valid_files']}/{results['total_files']} valid")
        return results
    
    def read_json(self, filename: str) -> Optional[Union[Dict, List]]:
        """
        Read and parse a JSON file
        
        Args:
            filename: Name of the JSON file
            
        Returns:
            Parsed JSON data or None if error
        """
        filepath = self.data_dir / filename
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            logger.info(f"Successfully read {filename}")
            return data
        except Exception as e:
            logger.error(f"Error reading {filename}: {e}")
            return None
    
    def write_json(self, filename: str, data: Union[Dict, List], indent: int = 2) -> bool:
        """
        Write data to a JSON file
        
        Args:
            filename: Name of the JSON file
            data: Data to write
            indent: JSON indentation level
            
        Returns:
            True if successful, False otherwise
        """
        filepath = self.data_dir / filename
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=indent, ensure_ascii=False)
            logger.info(f"Successfully wrote {filename}")
            return True
        except Exception as e:
            logger.error(f"Error writing {filename}: {e}")
            return False
    
    def merge_json_files(self, output_filename: str, pattern: str = "*.json") -> bool:
        """
        Merge multiple JSON files into one
        
        Args:
            output_filename: Name of output file
            pattern: File pattern to match
            
        Returns:
            True if successful, False otherwise
        """
        merged_data = []
        
        for json_file in self.data_dir.glob(pattern):
            if json_file.name == output_filename:
                continue
                
            data = self.read_json(json_file.name)
            if data is not None:
                if isinstance(data, list):
                    merged_data.extend(data)
                else:
                    merged_data.append(data)
        
        return self.write_json(output_filename, merged_data)
    
    def transform_data(self, input_file: str, output_file: str, 
                      transformer: callable) -> bool:
        """
        Transform JSON data using a custom function
        
        Args:
            input_file: Input JSON file
            output_file: Output JSON file
            transformer: Function to transform the data
            
        Returns:
            True if successful, False otherwise
        """
        data = self.read_json(input_file)
        if data is None:
            return False
        
        try:
            transformed_data = transformer(data)
            return self.write_json(output_file, transformed_data)
        except Exception as e:
            logger.error(f"Error transforming data: {e}")
            return False
    
    def generate_schema(self, data: Union[Dict, List]) -> Dict:
        """
        Generate a basic JSON schema from data
        
        Args:
            data: JSON data
            
        Returns:
            JSON schema
        """
        def get_type(value):
            if isinstance(value, bool):
                return "boolean"
            elif isinstance(value, int):
                return "integer"
            elif isinstance(value, float):
                return "number"
            elif isinstance(value, str):
                return "string"
            elif isinstance(value, list):
                return "array"
            elif isinstance(value, dict):
                return "object"
            elif value is None:
                return "null"
            return "string"
        
        if isinstance(data, dict):
            schema = {
                "type": "object",
                "properties": {}
            }
            for key, value in data.items():
                schema["properties"][key] = {
                    "type": get_type(value)
                }
                if isinstance(value, dict):
                    schema["properties"][key] = self.generate_schema(value)
                elif isinstance(value, list) and value:
                    schema["properties"][key]["items"] = {
                        "type": get_type(value[0])
                    }
            return schema
        elif isinstance(data, list):
            return {
                "type": "array",
                "items": self.generate_schema(data[0]) if data else {}
            }
        else:
            return {"type": get_type(data)}
    
    def create_backup(self, filename: str) -> bool:
        """
        Create a backup of a JSON file
        
        Args:
            filename: Name of file to backup
            
        Returns:
            True if successful, False otherwise
        """
        filepath = self.data_dir / filename
        if not filepath.exists():
            logger.error(f"File {filename} does not exist")
            return False
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{filepath.stem}_backup_{timestamp}.json"
        backup_path = self.data_dir / "backups" / backup_name
        backup_path.parent.mkdir(exist_ok=True)
        
        try:
            data = self.read_json(filename)
            backup_filepath = backup_path
            with open(backup_filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            logger.info(f"Backup created: {backup_name}")
            return True
        except Exception as e:
            logger.error(f"Error creating backup: {e}")
            return False
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about JSON files in data directory
        
        Returns:
            Dictionary with statistics
        """
        stats = {
            'total_files': 0,
            'total_size_bytes': 0,
            'files': []
        }
        
        for json_file in self.data_dir.rglob('*.json'):
            file_size = json_file.stat().st_size
            stats['total_files'] += 1
            stats['total_size_bytes'] += file_size
            
            stats['files'].append({
                'name': json_file.name,
                'path': str(json_file.relative_to(self.data_dir)),
                'size_bytes': file_size,
                'size_kb': round(file_size / 1024, 2),
                'modified': datetime.fromtimestamp(
                    json_file.stat().st_mtime
                ).isoformat()
            })
        
        stats['total_size_kb'] = round(stats['total_size_bytes'] / 1024, 2)
        stats['total_size_mb'] = round(stats['total_size_bytes'] / (1024 * 1024), 2)
        
        return stats


class JSONDatabaseSync:
    """Synchronize JSON data with database"""
    
    def __init__(self, database_url: Optional[str] = None):
        """
        Initialize database sync
        
        Args:
            database_url: Database connection URL
        """
        self.database_url = database_url or os.getenv('DATABASE_URL')
        
    def sync_to_database(self, json_data: Dict, table_name: str) -> bool:
        """
        Sync JSON data to database
        
        Args:
            json_data: JSON data to sync
            table_name: Target table name
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # This is a placeholder - implement actual database logic
            logger.info(f"Syncing data to table: {table_name}")
            logger.info(f"Data keys: {list(json_data.keys())}")
            return True
        except Exception as e:
            logger.error(f"Error syncing to database: {e}")
            return False
    
    def export_from_database(self, table_name: str, output_file: str) -> bool:
        """
        Export database table to JSON
        
        Args:
            table_name: Source table name
            output_file: Output JSON file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # This is a placeholder - implement actual database logic
            logger.info(f"Exporting from table: {table_name}")
            logger.info(f"Output file: {output_file}")
            return True
        except Exception as e:
            logger.error(f"Error exporting from database: {e}")
            return False


def main():
    """Main function for CLI usage"""
    processor = JSONDataProcessor()
    
    # Example usage
    print("JSON Data Processor")
    print("=" * 50)
    
    # Validate all JSON files
    results = processor.validate_all_files()
    print(f"\nValidation Results:")
    print(f"  Total files: {results['total_files']}")
    print(f"  Valid files: {results['valid_files']}")
    print(f"  Invalid files: {results['invalid_files']}")
    
    # Get statistics
    stats = processor.get_statistics()
    print(f"\nStatistics:")
    print(f"  Total files: {stats['total_files']}")
    print(f"  Total size: {stats['total_size_kb']} KB")
    
    if stats['files']:
        print(f"\nFiles:")
        for file_info in stats['files']:
            print(f"  - {file_info['name']} ({file_info['size_kb']} KB)")


if __name__ == "__main__":
    main()
