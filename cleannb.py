#!/usr/bin/env python3
import json
import sys
import os


def clean_notebook(notebook_path):
    """Remove outputs from a Jupyter notebook file."""
    with open(notebook_path, 'r', encoding='utf-8') as f:
        notebook = json.load(f)

    for cell in notebook['cells']:
        if cell['cell_type'] == 'code':
            cell['outputs'] = []
            cell['execution_count'] = None

    with open(notebook_path, 'w', encoding='utf-8') as f:
        json.dump(notebook, f, indent=1)


def clean_notebooks_in_directory(directory='.'):
    """Find and clean all Jupyter notebook files in a directory."""
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.ipynb') and not file.endswith('.nbconvert.ipynb'):
                notebook_path = os.path.join(root, file)
                clean_notebook(notebook_path)
                print(f"Cleaned: {notebook_path}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = sys.argv[1]
        if os.path.isdir(target):
            clean_notebooks_in_directory(target)
        elif os.path.isfile(target) and target.endswith('.ipynb'):
            clean_notebook(target)
            print(f"Cleaned: {target}")
        else:
            print(f"Error: {target} is not a notebook file or directory")
    else:
        clean_notebooks_in_directory()
