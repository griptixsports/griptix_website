"""Evaluation Engine module for Griptix Agentic Runtime.

Parses evaluation guidelines from Markdown files and executes automated checks
(unit tests, lint checks, type checks, build validation) to verify outputs.
"""

from typing import Any, Dict, List
from .loader import Loader


class EvaluationEngine:
    """Runs verification gates against files created/modified by agents."""

    def __init__(self, loader: Loader):
        """Initializes the EvaluationEngine.

        Args:
            loader: The Loader instance to retrieve evaluation criteria.
        """
        self.loader = loader

    def evaluate_task(self, task_id: str, files_changed: List[str]) -> Dict[str, Any]:
        """Runs the validation rules for a specific task and reports results.

        Args:
            task_id: The ID of the completed task to evaluate.
            files_changed: The list of absolute file paths modified/created.

        Returns:
            A dictionary containing:
                - 'success': bool
                - 'passed_checks': List[str]
                - 'failed_checks': List[str]
                - 'errors': List[str]
        """
        raise NotImplementedError("EvaluationEngine.evaluate_task is not implemented.")

    def run_check(self, check_name: str, check_type: str, arguments: List[str]) -> bool:
        """Executes a single command-based check (e.g. npx tsc --noEmit).

        Args:
            check_name: Name/label of the check.
            check_type: E.g., 'command', 'regex', 'custom_script'.
            arguments: Arguments for the validator.

        Returns:
            True if check passes, False otherwise.
        """
        raise NotImplementedError("EvaluationEngine.run_check is not implemented.")


if __name__ == "__main__":
    # Example usage of the EvaluationEngine class
    loader = Loader(base_dir="/path/to/project")
    engine = EvaluationEngine(loader)
    print("EvaluationEngine initialized.")
    try:
        engine.evaluate_task("STAGE1-001", ["/path/to/docker-compose.yml"])
    except NotImplementedError as e:
        print("Expected NotImplementedError caught: ", e)
