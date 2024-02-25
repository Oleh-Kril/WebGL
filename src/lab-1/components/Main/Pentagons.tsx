import React, {useRef} from 'react'
import {Color, OctahedronGeometry, Vector3} from 'three'
import {useFrame} from "@react-three/fiber"
import {useCurrentGroupId, usePolygons} from "../../store/polygonsAtom.ts"

type PentagonProps = {
    position: Vector3;
    color: Color;
    isSelected: boolean;
}

const Pentagon: React.FC<PentagonProps> = ({ position, color, isSelected=false }) => {
    const pentagonRef = useRef<any>();

    useFrame((state, delta) => {
        if (pentagonRef.current) {
            pentagonRef.current.rotation.x += 0.005;
        }
    });

    return (
        <group>
            <mesh ref={pentagonRef} position={position} scale={0.5}>
                <octahedronGeometry args={[1]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <lineSegments>
                <edgesGeometry attach="geometry" args={[new OctahedronGeometry(1)]} />
                <lineBasicMaterial attach="material" color={color}/>
            </lineSegments>
        </group>
    );
};

const Pentagons = () => {
    const [currentGroupId] = useCurrentGroupId();
    const [polygonGroups] = usePolygons();

    return (
        <>
            {polygonGroups.map(groupData => (
                groupData.vertices.map((position, index) => {
                    const isCurrentGroup = groupData.id === currentGroupId;
                    const adjustedPosition = position.clone().add(groupData.position);

                    return (
                        <Pentagon key={index} position={adjustedPosition} color={groupData.color} isSelected={isCurrentGroup} />
                    )
                })
            ))}
            {}
        </>
    );
};

export default Pentagons;
