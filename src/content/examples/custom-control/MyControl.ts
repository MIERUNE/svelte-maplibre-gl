import type * as maplibregl from 'maplibre-gl';

interface MyControlConstructorOptions {
	toggleTerrain: () => boolean;
	toggleHillshade: () => boolean;
}

class MyControl implements maplibregl.IControl {
	private _container: HTMLElement | undefined;
	private _toggleTerrain: () => boolean;
	private _toggleHillshade: () => boolean;

	constructor(options: MyControlConstructorOptions) {
		this._toggleTerrain = options.toggleTerrain;
		this._toggleHillshade = options.toggleHillshade;
	}

	onAdd() {
		this._container = document.createElement('div');
		this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group p-2 rounded flex w-[240px] gap-x-2';

		const toggleTerrain = document.createElement('button');
		toggleTerrain.textContent = 'Disable Terrain';
		toggleTerrain.type = 'button';
		toggleTerrain.style.backgroundColor = 'red';
		toggleTerrain.style.color = 'white';
		toggleTerrain.style.width = '50%';
		toggleTerrain.style.height = '100%';
		toggleTerrain.style.borderRadius = '0.25rem';
		toggleTerrain.addEventListener('click', () => {
			const newState = this._toggleTerrain();
			toggleTerrain.textContent = newState ? 'Disable Terrain' : 'Enable Terrain';
		});

		const toggleHillshade = document.createElement('button');
		toggleHillshade.textContent = 'Disable Hillshade';
		toggleHillshade.type = 'button';
		toggleHillshade.style.backgroundColor = 'blue';
		toggleHillshade.style.color = 'white';
		toggleHillshade.style.height = '100%';
		toggleHillshade.style.width = '50%';
		toggleHillshade.style.borderRadius = '0.25rem';
		toggleHillshade.addEventListener('click', () => {
			const newState = this._toggleHillshade();
			toggleHillshade.textContent = newState ? 'Disable Hillshade' : 'Enable Hillshade';
		});

		this._container.appendChild(toggleTerrain);
		this._container.appendChild(toggleHillshade);
		return this._container!;
	}

	onRemove() {
		if (this._container && this._container.parentNode) {
			this._container.parentNode.removeChild(this._container);
		}
	}
}

export { MyControl };
