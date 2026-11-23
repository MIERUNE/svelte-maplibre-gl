import { describe, expect, it } from 'vitest';
import type { Map } from 'maplibre-gl';
import { cameraSnapshot, getCamera, getUpdateTransform } from '../svelte-maplibre-gl/src/lib/utils';

describe('camera compatibility', () => {
	it('reads public camera state when the internal transform is absent', () => {
		const map = {
			_camera: {},
			getCenter: () => ({ lng: 114, lat: 22 }),
			getZoom: () => 18,
			getBearing: () => 30,
			getPitch: () => 45,
			getRoll: () => 0,
			getCenterElevation: () => 5,
			getPadding: () => ({ top: 1, right: 0, bottom: 0, left: 0 })
		} as unknown as Map;
		expect(getUpdateTransform(getCamera(map))).toBeUndefined();
		const state = cameraSnapshot(map);
		expect(state).toMatchObject({ center: { lng: 114, lat: 22 }, zoom: 18, bearing: 30, pitch: 45, elevation: 5 });
		expect(state.isPaddingEqual({ top: 1 })).toBe(true);
		expect(state.isPaddingEqual({ top: 2 })).toBe(false);
	});
	it('retains the pending transform on older cameras', () => {
		const transform = { zoom: 8 };
		const camera = getCamera({ _camera: { getTransformForUpdate: () => transform } } as unknown as Map);
		expect(getUpdateTransform(camera)).toBe(transform);
	});
});
