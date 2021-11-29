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

export function isApexTestClass() {
  const currentWindowEditor = vscode.window.activeTextEditor;
  if (currentWindowEditor) {
    const basename = Utils.basename(currentWindowEditor.document.uri);
    return basename.endsWith(".cls");
  } else {
    return "";
  }
}

export function getCurrentClassName() {
  const currentWindowEditor = vscode.window.activeTextEditor;
  if (currentWindowEditor && isApexTestClass()) {
    return Utils.basename(currentWindowEditor.document.uri).replace(".cls", "");
  } else {
    return "";
  }
}
