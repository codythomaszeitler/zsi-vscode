import { Utils } from "vscode-uri";
import * as vscode from "vscode";

export function runCurrentTestClass() {
  const currentWindowEditor = vscode.window.activeTextEditor;
  if (currentWindowEditor) {
    vscode.commands.executeCommand(
      "sfdx.force.apex.test.class.run",
      getCurrentClassName()
    );
  }
}

export function getCurrentClassName() {
  const currentWindowEditor = vscode.window.activeTextEditor;
  if (currentWindowEditor) {
    return Utils.basename(currentWindowEditor.document.uri).replace(".cls", "");
  } else {
    return "";
  }
}
