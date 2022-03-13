// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { runTestUnderneathCursor } from "./zsiRunTestUnderCursor";
import { runCurrentTestClass } from "./zsiRunCurrentTestClass";
import { deployGitDiff } from "./zsiDeployGitDiff";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("we are getting into the activate call");
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "zsi-vscode.runTestUnderCursor",
      runTestUnderneathCursor
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "zsi-vscode.runCurrentTestClass",
      runCurrentTestClass
    )
  );
  console.log(deployGitDiff);
  context.subscriptions.push(
    vscode.commands.registerCommand("zsi-vscode.deployGitDiff", deployGitDiff)
  );
}
// this method is called when your extension is deactivated
export function deactivate() {}
