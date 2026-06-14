"""Orchestrator module for Griptix Agentic Runtime.

Core orchestration loop that reads project state, identifies candidate tasks,
resolves their context, triggers execution via the Executor, evaluates
results via the EvaluationEngine, and commits state updates.
"""

from typing import Any, Dict, List
from .loader import Loader
from .memory_manager import MemoryManager
from .workflow_engine import WorkflowEngine
from .evaluation_engine import EvaluationEngine
from .executor import Executor


class Orchestrator:
    """The master coordinator for the entire Griptix systemization and build process."""

    def __init__(self, base_dir: str):
        """Initializes all engine components using the root directory.

        Args:
            base_dir: Absolute path to the workspace root.
        """
        self.base_dir = base_dir
        self.loader = Loader(base_dir)
        self.memory_manager = MemoryManager(self.loader)
        self.workflow_engine = WorkflowEngine(self.loader)
        self.evaluation_engine = EvaluationEngine(self.loader)
        self.executor = Executor(self.loader)

    def run_next_task(self) -> Dict[str, Any]:
        """Runs the next eligible, unblocked task from the task queue.

        Returns:
            A status dictionary representing the outcome of the cycle.
        """
        raise NotImplementedError("Orchestrator.run_next_task is not implemented.")

    def run_main_loop(self) -> None:
        """Starts the infinite/bounded execution loop for the agent pipeline."""
        raise NotImplementedError("Orchestrator.run_main_loop is not implemented.")


if __name__ == "__main__":
    # Example usage of the Orchestrator class
    orchestrator = Orchestrator(base_dir="/path/to/project")
    print("Orchestrator initialized with base_dir:", orchestrator.base_dir)
    try:
        orchestrator.run_next_task()
    except NotImplementedError as e:
        print("Expected NotImplementedError caught: ", e)
