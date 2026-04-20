type UndoRedoShortcut = {
	key: string;
	heldKeys: string[];
};

type UndoRedoKeyboardShortcuts = {
	undo: UndoRedoShortcut[];
	redo: UndoRedoShortcut[];
};

export type UndoRedoOptions = {
	keyboardShortcuts?: UndoRedoKeyboardShortcuts;
};