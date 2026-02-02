import {clamp, degreesToRadians} from './util';
import type {IReadonlyTransform} from '../geo/transform_interface';

export const DEFAULT_STABLE_ZOOM_MAX_LAT = 85;
const STABLE_ZOOM_MIN_COS = 0.000001;

export const getStableZoom = (transform: IReadonlyTransform, maxLat: number): number => {
    const lat = clamp(transform.center.lat, -maxLat, maxLat);
    const cos = Math.cos(degreesToRadians(lat));
    const safeCos = Math.max(STABLE_ZOOM_MIN_COS, Math.abs(cos));
    return transform.zoom + Math.log2(1 / safeCos);
};

export const getStableZoomForSource = (
    transform: IReadonlyTransform,
    source: {stableZoom?: boolean; stableZoomMaxLat?: number} | null | undefined,
    defaultMaxLat: number = DEFAULT_STABLE_ZOOM_MAX_LAT
): number | undefined => {
    if (!source?.stableZoom) return undefined;
    const maxLat = source.stableZoomMaxLat ?? defaultMaxLat;
    return getStableZoom(transform, maxLat);
};
