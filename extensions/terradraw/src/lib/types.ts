type ShortcutHeldKey = "meta" | "shift" | "control";

type UndoRedoShortcut = {
	key: string;
	heldKeys: ShortcutHeldKey[];
	maxStackSize?: number
};

type UndoRedoKeyboardShortcuts = {
	undo: UndoRedoShortcut[];
	redo: UndoRedoShortcut[];
};

export type UndoRedoOptions = {
	keyboardShortcuts?: UndoRedoKeyboardShortcuts;
};
