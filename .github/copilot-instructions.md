

## Code Style and Formatting
### When writing Python code:

Prefer using f-strings for string formatting over .format() or % formatting
Use type hints for function signatures and class attributes
Prefer functions and classes over complex one-liners
Use simple and clear variable names that describe their purpose
Avoid deep nesting of code blocks (max 3-4 levels)
Follow PEP 8 naming conventions (snake_case for variables/functions, PascalCase for classes)
Use double quotes for strings unless single quotes avoid escaping
Prefer readable code over clever code

### Function and Class Design

Write small, focused functions that do one thing well
Use descriptive function and method names that explain what they do
Add docstrings to all functions, classes, and modules using Google or NumPy style
Prefer explicit return types in type hints
Use dataclasses or Pydantic models for data structures instead of plain dictionaries
Implement __str__ and __repr__ methods for custom classes

### Error Handling and Validation

Use specific exception types rather than bare except: clauses
Validate inputs early in functions and raise appropriate exceptions
Prefer EAFP (Easier to Ask for Forgiveness than Permission) over LBYL
Use context managers (with statements) for resource management
Include meaningful error messages that help with debugging

### Data Structures and Algorithms

Use list comprehensions for simple transformations, but prefer explicit loops for complex logic
Leverage built-in functions like enumerate(), zip(), any(), all()
Use pathlib.Path instead of os.path for file operations
Prefer collections module types (defaultdict, Counter, deque) when appropriate
Use generators for memory-efficient iteration over large datasets

### Dependencies and Imports

Group imports: standard library, third-party, local imports (separated by blank lines)
Use absolute imports over relative imports
Import specific functions/classes rather than entire modules when possible


### Performance and Best Practices

Use logging module instead of print() statements for debugging
Prefer f"..." over string concatenation in loops
Use tuple for immutable sequences, list for mutable ones
Cache expensive computations with @functools.lru_cache
Use typing.Optional[T] or T | None (Python 3.10+) for nullable types


### What to Avoid

Avoid bare except: clauses
Don't use mutable default arguments (def func(items=[]):)
Avoid deep nesting - extract helper functions instead
Don't use eval() or exec() with user input
Avoid global variables - pass data explicitly
Don't use import * except in __init__.py files
Avoid overly clever one-liners that sacrifice readability