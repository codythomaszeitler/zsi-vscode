import * as vscode from "vscode";
import {
  runCurrentTestClass,
  getCurrentClassName,
} from "./zsiRunCurrentTestClass";

export function runTestUnderneathCursor() {
  const currentWindowEditor = vscode.window.activeTextEditor;
  const getLineContents = (position: vscode.Position) => {
    if (currentWindowEditor) {
      const lineUnderCursor = currentWindowEditor.document.lineAt(
        position.line
      ).text;
      return lineUnderCursor;
    } else {
      return "";
    }
  };

  const getPositionContents = (position: vscode.Position) => {
    if (currentWindowEditor) {
      const range =
        currentWindowEditor.document.getWordRangeAtPosition(position);
      if (!range) {
        return "";
      }

      const positionContents = currentWindowEditor.document.getText(range);
      return positionContents;
    } else {
      return "";
    }
  };

  const isCurrentyHoveredATestMethod = () => {
    if (!currentWindowEditor) {
      return false;
    }

    let previousLineNumber;
    try {
      previousLineNumber = currentWindowEditor.selection.active.translate(-1);
    } catch (e) {
      return false;
    }

    const previousLineContents = getLineContents(previousLineNumber);
    const currentLineContents = getLineContents(
      currentWindowEditor.selection.active
    );

    const currentPositionContents = getPositionContents(
      currentWindowEditor.selection.active
    );

    if (
      currentPositionContents === "private" ||
      currentPositionContents === "static" ||
      currentPositionContents === "void"
    ) {
      return false;
    }

    return (
      previousLineContents.includes("IsTest") &&
      currentLineContents.includes("(") &&
      currentLineContents.includes(")")
    );
  };

  if (currentWindowEditor) {
    const className = getCurrentClassName();

    if (isCurrentyHoveredATestMethod()) {
      const methodName = getPositionContents(
        currentWindowEditor.selection.active
      );
      const sfdxMethodToRun = className + "." + methodName;
      vscode.commands.executeCommand(
        "sfdx.force.apex.test.method.run",
        sfdxMethodToRun
      );
    } else {
      runCurrentTestClass();
    }
  }
}
