export { default as TerraDraw } from './TerraDraw.svelte';

import { TerraDrawModeUndoRedo, TerraDrawSessionUndoRedo, TerraDrawUndoRedoKeyboardShortcuts } from 'terra-draw';

export type UndoRedoOptions = {
	sessionLevel?: ConstructorParameters<typeof TerraDrawSessionUndoRedo>[0];
	modeLevel?: ConstructorParameters<typeof TerraDrawModeUndoRedo>[0];
	keyboardShortcuts?: ConstructorParameters<typeof TerraDrawUndoRedoKeyboardShortcuts>[0];
};
