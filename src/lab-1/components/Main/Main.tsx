import {Canvas} from "@react-three/fiber"
import Controls from "./Controls.tsx"
import Pentagons from "./Pentagons.tsx"

export default function Main(){
    return (
        <div
            style={{ width: '100vw', height: '100vh' }}
            tabIndex={0}
        >
            <Canvas>
                <Controls />
                <ambientLight />
                <directionalLight position={[10, 5, 10]} />
                <Pentagons />
            </Canvas>
        </div>
    );
}
