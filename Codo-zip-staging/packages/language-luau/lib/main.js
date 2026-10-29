const { CompositeDisposable } = require('atom');

const TYPE_HINT = /\blocal\s+([A-Za-z_][\w]*)\s*=\s*(["'][^"']*["']|\d+(?:\.\d+)?|true|false|nil)\b/;

function inferredType(value) {
  if (value === 'true' || value === 'false') return 'boolean';
  if (value === 'nil') return 'nil';
  if (/^["']/.test(value)) return 'string';
  if (/^\d/.test(value)) return 'number';
  return null;
}

function createHint(editor, row, column, text) {
  const marker = editor.markBufferPosition({ row, column }, { invalidate: 'never' });
  const element = document.createElement('span');
  element.className = 'codo-luau-inlay-hint';
  element.textContent = `: ${text}`;
  const decoration = editor.decorateMarker(marker, {
    type: 'overlay',
    position: 'tail',
    item: element,
    avoidOverflow: false
  });
  return {
    dispose() {
      decoration?.destroy?.();
      marker.destroy();
    }
  };
}

function updateHints(editor, subscriptions) {
  subscriptions.splice(0).forEach(disposable => disposable.dispose());
  if (
    !atom.config.get('editor.luauInlayHints') ||
    editor.getGrammar().scopeName !== 'source.luau'
  ) {
    return;
  }

  editor.getBuffer().getLines().forEach((line, row) => {
    const match = line.match(TYPE_HINT);
    if (!match) return;
    const type = inferredType(match[2]);
    if (type) subscriptions.push(createHint(editor, row, match[0].length, type));
  });
}

module.exports = {
  activate() {
    this.disposables = new CompositeDisposable();
    this.editorHints = new Map();
    this.disposables.add(atom.workspace.observeTextEditors(editor => {
      const hints = [];
      this.editorHints.set(editor, hints);
      const refresh = () => updateHints(editor, hints);
      this.disposables.add(editor.getBuffer().onDidChange(refresh));
      this.disposables.add(atom.config.observe('editor.luauInlayHints', refresh));
      this.disposables.add(editor.onDidChangeGrammar(refresh));
      this.disposables.add(editor.onDidDestroy(() => {
        hints.splice(0).forEach(disposable => disposable.dispose());
        this.editorHints.delete(editor);
      }));
      refresh();
    }));
  },

  deactivate() {
    this.disposables?.dispose();
    for (const hints of this.editorHints?.values() || []) {
      hints.splice(0).forEach(disposable => disposable.dispose());
    }
    this.editorHints?.clear();
  }
};
