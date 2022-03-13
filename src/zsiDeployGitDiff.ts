import * as vscode from "vscode";
import { Utils } from "vscode-uri";
// Import `SimpleGit` types and the default function exported from `simple-git`
import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";

export async function deployGitDiff() {
  getGitDiff("", "");
}

function getCurrentTopLevelDir() {
  if (
    !vscode.workspace.workspaceFolders ||
    !vscode.workspace.workspaceFolders[0]
  ) {
    return "TOP-LEVEL-NOT-FOUND";
  }
  return vscode.workspace.workspaceFolders[0].uri.fsPath;
}

async function getGitDiff(from: string, to: string) {
  try {
    const options: Partial<SimpleGitOptions> = {
      baseDir: getCurrentTopLevelDir(),
      binary: "git",
      maxConcurrentProcesses: 6,
    };

    const git: SimpleGit = simpleGit(options);
    const commands = ["diff", "--name-only", "--diff-filter=AC", "main"];

    // using a var-args of strings and awaiting rather than using the callback
    const output = await git.raw(...commands);

    const changedFiles = output.split("\n").filter((element: string) => {
      return element;
    });

    const toDeploy = [];
    for (let changedFile of changedFiles) {
      const a = vscode.workspace.asRelativePath(changedFile);
      toDeploy.push(vscode.Uri.file(getCurrentTopLevelDir() + changedFile));
    }

    // Okay if I try to remember where I was on this... I wanted
    // to be able to see the difference between two branches

    vscode.commands.executeCommand(
      "sfdx.force.source.deploy.multiple.source.paths",
      toDeploy[0],
      toDeploy
    );
  } catch (e) {
    console.log(e);
  }
}

function splitFilesByMetadata(gitOutput: string) {
  const changedFiles = gitOutput.split("\n").filter((element: string) => {
    return element;
  });

  const metadata = {
    classes: new Array<string>(),
  };

  for (let changedFile of changedFiles) {
    if (changedFile.includes("/classes/")) {
      if (!changedFile.includes("-meta.xml")) {
        metadata.classes.push(changedFile);
      }
    }
  }
  return metadata;
}
