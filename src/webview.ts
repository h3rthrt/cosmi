import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Регистрируем провайдер для нашей вкладки
  const provider = new MyWebviewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'myWebviewView',  // Должен совпадать с `id` из package.json
      provider
    )
  );
}

class MyWebviewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,  // Разрешаем JavaScript
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlContent(webviewView.webview);
  }

  private _getHtmlContent(webview: vscode.Webview): string {
    // Подключаем CSS/JS из папки расширения
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css')
    );

    return `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${styleUri}" rel="stylesheet">
        </head>
        <body>
          <h1>Привет из Webview!</h1>
          <button id="myButton">Нажми меня</button>
          <script src="${scriptUri}"></script>
        </body>
      </html>`;
  }
}