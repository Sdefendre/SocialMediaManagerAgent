---
name: doc-generator
description: Generates documentation for code, functions, classes, and projects. Use when the user asks to document code, create README files, add docstrings, generate API docs, or explain code structure.
---

# Documentation Generator

## Instructions

When asked to generate documentation:

1. **Analyze the code** - Read and understand the structure, purpose, and behavior
2. **Identify documentation needs** - Functions, classes, modules, APIs, or project-level docs
3. **Generate appropriate documentation** based on the context:
   - **Docstrings** for functions/methods/classes
   - **README.md** for projects
   - **API documentation** for endpoints
   - **Inline comments** for complex logic

## Documentation Standards

### Function/Method Docstrings

```python
def function_name(param1: type, param2: type) -> return_type:
    """Brief description of what the function does.

    Args:
        param1: Description of first parameter.
        param2: Description of second parameter.

    Returns:
        Description of what is returned.

    Raises:
        ErrorType: When this error occurs.
    """
```

### Class Docstrings

```python
class ClassName:
    """Brief description of the class.

    Attributes:
        attr1: Description of attribute.
        attr2: Description of attribute.

    Example:
        >>> obj = ClassName()
        >>> obj.method()
    """
```

### README Structure

1. **Title** - Project name
2. **Description** - What it does and why
3. **Installation** - How to set it up
4. **Usage** - Basic examples
5. **API/Features** - Key functionality
6. **Contributing** - How to contribute
7. **License** - License information

## Best Practices

- Be concise but complete
- Focus on the "why" not just the "what"
- Include usage examples where helpful
- Use consistent formatting
- Keep documentation close to the code it describes
- Update docs when code changes

## Example Prompts

- "Document this function"
- "Create a README for this project"
- "Add docstrings to this class"
- "Generate API documentation for these endpoints"
