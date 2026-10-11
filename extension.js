const vscode = require('vscode');

const GEMINI_URL = 'https://gemini.google.com/';
const INTEGRATED_BROWSER_COMMAND = 'workbench.action.browser.open';
const OPEN_COPILOT_CHAT_COMMAND = 'workbench.action.chat.open';

function activate(context) {
  const provider = new GeminiBrowserViewProvider();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('gemini.browser', provider),
    vscode.commands.registerCommand('gemini.openBrowser', openGemini)
  );
}

async function openGemini() {
  try {
    await vscode.commands.executeCommand(INTEGRATED_BROWSER_COMMAND, GEMINI_URL);
  } catch (error) {
    const detail = error instanceof Error ? ` ${error.message}` : '';
    await vscode.window.showErrorMessage(`Could not open Gemini in VS Code's integrated browser.${detail}`);
  }

  try {
    await vscode.commands.executeCommand(OPEN_COPILOT_CHAT_COMMAND);
  } catch (error) {
    const detail = error instanceof Error ? ` ${error.message}` : '';
    await vscode.window.showErrorMessage(`Could not return to Copilot Chat.${detail}`);
  }
}

class GeminiBrowserViewProvider {
  resolveWebviewView(webviewView) {
    webviewView.webview.html = '<!DOCTYPE html><html lang="en"><body></body></html>';

    let wasVisible = webviewView.visible;
    if (wasVisible) {
      void openGemini();
    }

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible && !wasVisible) {
        void openGemini();
      }
      wasVisible = webviewView.visible;
    });
  }
}

module.exports = { activate };
