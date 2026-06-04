# Contributing to Crawler

Thank you for your interest in contributing to the Crawler project! We welcome contributions from everyone. This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions. Harassment, discrimination, or disruptive behavior will not be tolerated.

## How to Contribute

There are many ways to contribute to this project:

- **Report bugs** by opening an issue with detailed information
- **Suggest features** with clear use cases and expected behavior
- **Improve documentation** by fixing typos or clarifying confusing sections
- **Submit code changes** by creating pull requests with meaningful improvements
- **Review pull requests** and provide constructive feedback to other contributors

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Git
- A MySQL database for testing (optional but recommended)
- A code editor or IDE of your choice

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/crawler.git
   cd crawler
   ```
3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install development dependencies:
   ```bash
   pip install -r requirements-dev.txt
   ```
5. Create a local `.env` file for testing:
   ```bash
   cp .env.example .env
   ```

## Making Changes

### Branch Naming

Create a descriptive branch name for your changes:
- `feature/add-proxy-support`
- `bugfix/fix-mysql-connection-timeout`
- `docs/improve-readme`
- `test/add-crawler-tests`

```bash
git checkout -b feature/your-feature-name
```

### Code Style

Follow these guidelines to maintain consistent code quality:

- Use PEP 8 style guide for Python code
- Keep lines under 100 characters when possible
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Use type hints where applicable

Example:
```python
def fetch_url(url: str, timeout: int = 10) -> str:
    """
    Fetch content from a given URL.
    
    Args:
        url: The URL to fetch
        timeout: Request timeout in seconds (default: 10)
    
    Returns:
        The HTML content of the page
    
    Raises:
        requests.exceptions.RequestException: If the request fails
    """
    response = requests.get(url, timeout=timeout)
    response.raise_for_status()
    return response.text
```

### Testing

Before submitting a pull request, ensure your code passes all tests:

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=crawler

# Run specific test file
pytest tests/test_crawler.py
```

Write tests for new features:
```python
def test_fetch_url_success():
    """Test that fetch_url returns content for valid URLs."""
    result = fetch_url("https://example.com")
    assert result is not None
    assert len(result) > 0
```

### Commits

Write clear, descriptive commit messages:

```bash
# Good
git commit -m "Add proxy support to crawler

- Add ProxyManager class to handle proxy rotation
- Update fetch_url to accept proxy configuration
- Add tests for proxy connection handling"

# Avoid
git commit -m "fix stuff"
git commit -m "changes"
```

## Submitting Changes

### Pull Request Process

1. Ensure all tests pass and code is formatted correctly
2. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a pull request on GitHub with:
   - A clear title describing the change
   - A detailed description of what was changed and why
   - Reference to any related issues (e.g., "Fixes #123")
   - Screenshots or examples if applicable
4. Address review comments and make requested changes
5. Ensure the CI/CD pipeline passes
6. Once approved, your PR will be merged

### Pull Request Template

```markdown
## Description
Brief explanation of what this PR does.

## Changes Made
- Change 1
- Change 2
- Change 3

## Related Issues
Fixes #123

## Testing
Describe how you tested these changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No breaking changes (or documented in PR)
```

## Reporting Bugs

When reporting bugs, please include:

- **Description**: What you were trying to do
- **Expected behavior**: What should have happened
- **Actual behavior**: What actually happened
- **Environment**: Python version, OS, MySQL version
- **Steps to reproduce**: Clear steps to replicate the issue
- **Error message**: Full error traceback if available
- **Screenshots**: If applicable

Example:
```
Title: Crawler fails with timeout on large datasets

Description: When crawling more than 10,000 pages, the crawler 
consistently times out.

Steps to reproduce:
1. Configure crawler with 15,000 pages
2. Run `python crawler.py`
3. After ~8,000 pages, connection fails

Expected: Crawler should complete all 15,000 pages
Actual: Crawler crashes with timeout error

Environment: Python 3.9, Ubuntu 20.04, MySQL 8.0
```

## Suggesting Features

When suggesting features, explain:

- **Use case**: Why this feature is needed
- **Expected behavior**: How it should work
- **Alternative approaches**: Other possible implementations
- **Impact**: How it affects existing functionality

## Documentation

Help improve documentation by:

- Fixing typos and grammatical errors
- Adding missing sections or examples
- Clarifying confusing explanations
- Adding inline code comments for complex logic