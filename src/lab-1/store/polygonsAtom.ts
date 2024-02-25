import { atom, useAtom } from 'jotai';
import {Color, Vector3} from "three"

const DEFAULT_POLYGON: PolygonsData = {
    id: 1,
    vertices: [],
    color: new Color("hotpink"),
    position: new Vector3(0,0,0)
};

type PolygonsData = {
    id: number,
    vertices: Vector3[],
    color: Color,
    position: Vector3,
};

const polygonsAtom = atom<PolygonsData[]>([DEFAULT_POLYGON]);

const usePolygons = () => useAtom(polygonsAtom);

const currentGroupIdAtom = atom<number>(1);
const useCurrentGroupId = () => useAtom(currentGroupIdAtom);

export { polygonsAtom, usePolygons, DEFAULT_POLYGON, currentGroupIdAtom, useCurrentGroupId };
