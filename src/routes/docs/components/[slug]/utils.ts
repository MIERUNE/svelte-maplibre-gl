import type { DisplayPart, TypeOrRef, Types } from 'svelte-docgen/doc';

export function formatType(type: TypeOrRef, types: Types): string {
	const visited = new Set<TypeOrRef>();
	const [res] = _format(type, types, visited, true);
	return res;
}

function _formatWrapper(
	type: TypeOrRef,
	types: Types,
	visited: Set<TypeOrRef>,
	ignoreUndefined = false
): [string, boolean] {
	if (visited.has(type)) {
		return ['...', false];
	}
	visited.add(type);
	const formatted = _format(type, types, visited, ignoreUndefined);
	visited.delete(type);
	return formatted;
}

function _format(type: TypeOrRef, types: Types, visited: Set<TypeOrRef>, ignoreUndefined = false): [string, boolean] {
	if (typeof type === 'string') {
		return _formatWrapper(types.get(type)!, types, visited, ignoreUndefined);
	}
	if ('alias' in type && type.alias) {
		const name = formatQualifiedName(type.alias);
		if (
			!type.alias.endsWith('Like') &&
			(type.kind !== 'union' || type.types.some((t) => typeof t === 'string' || t.kind !== 'literal'))
		) {
			return [name, false];
		}
	}
	if (type.kind === 'array') {
		const [res, needParens] = _formatWrapper(type.element, types, visited);
		return needParens ? [`${res}[]`, false] : [`(${res})[]`, false];
	} else if (type.kind === 'tuple') {
		const elements = type.elements.map((t) => _formatWrapper(t, types, visited)[0]).join(', ');
		return [`[${elements}]`, false];
	} else if (type.kind === 'literal') {
		switch (type.subkind) {
			case 'string':
				return [`"${type.value}"`, false];
			case 'number':
				return [`${type.value}`, false];
			case 'boolean':
				return [`${type.value}`, false];
			default:
				return [type.subkind, false];
		}
	} else if (type.kind === 'constructible') {
		return [formatQualifiedName(type.name), false];
	} else if (type.kind === 'function') {
		if (type.calls.length !== 1) {
			return ['function', false];
		}
		const call = type.calls[0];
		const params = call.parameters
			.map((p) => {
				const optional = p.isOptional ? '?' : '';
				return `${p.name}${optional}: ${_formatWrapper(p.type, types, visited)[0]}`;
			})
			.join(', ');
		return [`(${params}) => ${_formatWrapper(call.returns, types, visited)[0]}`, true];
	} else if (type.kind === 'union') {
		const res = type.types
			.filter((t) => !ignoreUndefined || typeof t === 'string' || t.kind !== 'undefined')
			.map((t) => _formatWrapper(t, types, visited)[0])
			.join(' | ');
		return [res, false];
	} else if (type.kind === 'intersection') {
		const res = type.types.map((t) => _formatWrapper(t, types, visited)[0]).join(' | ');
		return [res, true];
	} else if (type.kind === 'interface') {
		const members = type.members
			.entries()
			.map(([name, m]) => {
				const type = _formatWrapper(m.type, types, visited, m.isOptional)[0];
				const optional = m.isOptional ? '?' : '';
				return `${name}${optional}: ${type}`;
			})
			.toArray()
			.join(', ');
		return [`{ ${members} }`, false];
	} else if (type.kind === 'type-parameter') {
		return [formatQualifiedName(type.name), false];
	}
	return [type.kind, false];
}

function formatQualifiedName(name: string): string {
	let alias = name;
	const lastDotIndex = name.lastIndexOf('.');
	let prefix = '';
	if (lastDotIndex !== -1) {
		prefix = name.slice(0, lastDotIndex);
		alias = name.slice(lastDotIndex + 1);
	}
	if (prefix.includes('/maplibre-gl"')) {
		return `<a target="_blank" href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/${alias}/">${alias}</a>`;
	}
	return alias;
}

export function formatDescription(description: DisplayPart[]): string {
	return description
		.filter((p) => p.kind === 'text')
		.map((part) => part.text)
		.join('');
}
