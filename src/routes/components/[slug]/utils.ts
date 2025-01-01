import type { TypeOrRef, Types } from 'svelte-docgen/doc';

export function formatType(type: TypeOrRef, types: Types): string {
	return _format(type, types, true);
}

function _format(type: TypeOrRef, types: Types, toplevel = false): string {
	if (typeof type === 'string') {
		return _format(types.get(type)!, types);
	} else if ('alias' in type && type.alias) {
		let alias = type.alias;
		const lastDotIndex = type.alias.lastIndexOf('.');
		let prefix = '';
		if (lastDotIndex !== -1) {
			prefix = type.alias.slice(0, lastDotIndex);
			alias = type.alias.slice(lastDotIndex + 1);
		}
		if (prefix.includes('/maplibre-gl"')) {
			return `<a target="_blank" href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/${alias}/">${alias}</a>`;
		}
		return alias;
	} else if (type.kind === 'array') {
		return `${formatType(type.element, types)}[]`;
	} else if (type.kind === 'tuple') {
		const elements = type.elements.map((t) => _format(t, types, false)).join(', ');
		return `[${elements}]`;
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
			return _format(type.nonNullable, types, true);
		}
		return type.types.map((t) => _format(t, types, false)).join(' | ');
	} else if (type.kind === 'intersection') {
		return type.types.map((t) => _format(t, types, false)).join(' | ');
	} else if (type.kind === 'interface') {
		// const members = type.members
		// 	.entries()
		// 	.map(([name, m]) => {
		// 		const type = _format(m.type, types, false);
		// 		const optional = m.isOptional ? '?' : '';
		// 		return `${name}${optional}: ${type}`;
		// 	})
		// 	.toArray()
		// 	.join(', ');
		const members = '...';
		return `{ ${members} }`;
	}
	return type.kind;
}
