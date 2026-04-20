type ShortcutHeldKey = "meta" | "shift" | "control";

type UndoRedoShortcut = {
	key: string;
	heldKeys: ShortcutHeldKey[];
};

type UndoRedoKeyboardShortcuts = {
	undo: UndoRedoShortcut[];
	redo: UndoRedoShortcut[];
};

type StackSizeConfig = {
	maxStackSize: number
}

export type UndoRedoOptions = {
	sessionLevel?: StackSizeConfig;
	modeLevel?: StackSizeConfig;
	keyboardShortcuts?: UndoRedoKeyboardShortcuts;
};
