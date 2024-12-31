import type { TypeOrRef, Types } from 'svelte-docgen/doc';

export function formatType(type: TypeOrRef, types: Types): string {
	return _formatTypeInner(type, types, true);
}

function _formatTypeInner(type: TypeOrRef, types: Types, toplevel = false): string {
	if (typeof type === 'string') {
		return formatType(types.get(type)!, types);
	} else if (type.kind === 'array') {
		return `${formatType(type.element, types)}[]`;
	} else if (type.kind === 'literal') {
		switch (type.subkind) {
			case 'string':
				return `"${type.value}"`;
			case 'number':
				return `${type.value}`;
			case 'boolean':
				return `${type.value}`;
			default:
				return type.subkind;
		}
	} else if (type.kind === 'union') {
		if (toplevel && type.nonNullable) {
			return _formatTypeInner(type.nonNullable, types, true);
		}
		return type.types.map((t) => _formatTypeInner(t, types, false)).join(' | ');
	} else if (type.kind === 'intersection') {
		return type.types.map((t) => _formatTypeInner(t, types, false)).join(' | ');
	}
	return type.kind;
}
