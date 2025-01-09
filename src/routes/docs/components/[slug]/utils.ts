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
	const [formatted, needParens] = _format(type, types, visited, ignoreUndefined);
	visited.delete(type);
	return [formatted, needParens];
}

function _format(type: TypeOrRef, types: Types, visited: Set<TypeOrRef>, ignoreUndefined = false): [string, boolean] {
	if (typeof type === 'string') {
		return _formatWrapper(types.get(type)!, types, visited, ignoreUndefined);
	}
	if ('alias' in type && type.alias) {
		let name = formatQualifiedName(type.alias);
		if (
			!type.alias.endsWith('Like') &&
			(type.kind !== 'union' || type.types.some((t) => typeof t === 'string' || t.kind !== 'literal'))
		) {
			if (type.aliasTypeArgs?.length) {
				name += formatTypeArgs(type.aliasTypeArgs, types, visited);
			}
			if (type.kind === 'function') {
				name += '()';
			}
			return [name, false];
		}
	}
	if (type.kind === 'array') {
		const [res, needParens] = _formatWrapper(type.element, types, visited);
		return needParens ? [`(${res})[]`, false] : [`${res}[]`, false];
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
		let name = formatQualifiedName(type.name, 'classes');
		if (type.typeArgs?.length) {
			name += formatTypeArgs(type.typeArgs, types, visited);
		}
		return [name, false];
	} else if (type.kind === 'function') {
		if (type.name === '"svelte".Snippet') {
			let name = '<a target="_blank" href="https://svelte.dev/docs/svelte/snippet">Snippet</a>';
			if (type.typeArgs?.length) {
				name += formatTypeArgs(type.typeArgs, types, visited);
			}
			return [name, false];
		}
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
		if (type.members.size === 0) {
			return ['{}', false];
		}
		const members = type.members
			.entries()
			.map(([name, m]) => {
				const type = _formatWrapper(m.type, types, visited, m.isOptional)[0];
				const optional = m.isOptional ? '?' : '';
				return `  ${name}${optional}: ${type}`;
			})
			.toArray()
			.join(',\n');
		return [`{\n${members}\n}`, false];
	} else if (type.kind === 'type-parameter') {
		return [formatQualifiedName(type.name), false];
	}
	return [type.kind, false];
}

function formatTypeArgs(typeArgs: TypeOrRef[], types: Types, visited: Set<TypeOrRef>): string {
	const args = typeArgs.map((t) => _formatWrapper(t, types, visited)[0]).join(', ');
	return `&lt;${args}&gt;`;
}

const MDN_API = new Set([
	'CSSStyleDeclaration',
	'GeolocateEvent',
	'GeolocationPosition',
	'GeolocationPositionError',
	'HTMLCanvasElement',
	'HTMLDivElement',
	'HTMLElement',
	'HTMLImageElement',
	'ImageBitmap',
	'ImageData',
	'MouseEvent',
	'TouchEvent',
	'WebGLRenderingContext',
	'WebGL2RenderingContext',
	'WheelEvent'
]);

const MDN_OBJECTS = new Set(['SharedArrayBuffer', 'ArrayBuffer', 'Uint8Array', 'Uint8ClampedArray']);

function formatQualifiedName(name: string, link: string = 'type-aliases'): string {
	let alias = name;
	const lastDotIndex = name.lastIndexOf('.');
	let prefix = '';
	if (lastDotIndex !== -1) {
		prefix = name.slice(0, lastDotIndex);
		alias = name.slice(lastDotIndex + 1);
	}
	if (MDN_API.has(alias)) {
		return `<a target="_blank" href="https://developer.mozilla.org/docs/Web/API/${alias}">${alias}</a>`;
	}
	if (MDN_OBJECTS.has(alias)) {
		return `<a target="_blank" href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/${alias}">${alias}</a>`;
	}
	if (alias === 'Map$1') {
		return `<a target="_blank" href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/">Map</a>`;
	}
	if (prefix.includes('/maplibre-gl"')) {
		return `<a target="_blank" href="https://maplibre.org/maplibre-gl-js/docs/API/${link}/${alias}/">${alias}</a>`;
	}
	return alias;
}

export function formatDescription(description: DisplayPart[]): string {
	return description
		.filter((p) => p.kind === 'text')
		.map((part) => part.text)
		.join('');
}
