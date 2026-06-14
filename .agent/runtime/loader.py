"""Loader module for Griptix Agentic Runtime.

Responsible for reading skill, memory, and workflow definitions from disk
and parsing them into standard Python dictionary structures.
"""

import os
import json
from typing import Any, Dict, List, Union


class Loader:
    """Loads and validates configuration files for the agent framework."""

    def __init__(self, base_dir: str):
        """Initializes the loader with a base directory.

        Args:
            base_dir: The absolute path to the root of the project.
        """
        self.base_dir = base_dir
        self.agent_dir = os.path.join(base_dir, ".agent")

    def load_json(self, relative_path: str) -> Dict[str, Any]:
        """Loads and parses a JSON file relative to the project root.

        Args:
            relative_path: The relative path to the JSON file.

        Returns:
            A dictionary containing the parsed JSON data.
        """
        raise NotImplementedError("Loader.load_json is not implemented.")

    def load_markdown(self, relative_path: str) -> str:
        """Loads a Markdown file relative to the project root.

        Args:
            relative_path: The relative path to the Markdown file.

        Returns:
            The raw string content of the markdown file.
        """
        raise NotImplementedError("Loader.load_markdown is not implemented.")

    def load_skill(self, skill_id: str) -> Dict[str, Any]:
        """Loads a skill definition file from .agent/skills/.

        Args:
            skill_id: The identifier of the skill (e.g., 'stage1_foundation').

        Returns:
            A dictionary representing the skill.
        """
        raise NotImplementedError("Loader.load_skill is not implemented.")

    def load_workflow(self, workflow_name: str) -> Dict[str, Any]:
        """Loads a workflow definition file from .agent/workflows/.

        Args:
            workflow_name: The name of the workflow (e.g., 'frontend_build').

        Returns:
            A dictionary representing the workflow.
        """
        raise NotImplementedError("Loader.load_workflow is not implemented.")

    def load_memory(self, memory_name: str) -> Dict[str, Any]:
        """Loads a memory file from .agent/memory/.

        Args:
            memory_name: The name of the memory file (e.g., 'tech_stack').

        Returns:
            A dictionary representing the memory.
        """
        raise NotImplementedError("Loader.load_memory is not implemented.")


if __name__ == "__main__":
    # Example usage of the Loader class
    loader = Loader(base_dir="/path/to/project")
    print("Loader initialized: ", loader.agent_dir)
    try:
        loader.load_memory("tech_stack")
    except NotImplementedError as e:
        print("Expected NotImplementedError caught: ", e)
