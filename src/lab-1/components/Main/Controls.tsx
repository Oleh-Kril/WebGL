import {Color, Vector3} from "three"
import {DEFAULT_POLYGON, usePolygons} from "../../store/polygonsAtom.ts"
import {useThree} from "@react-three/fiber"
import { Html } from "@react-three/drei"
import styles from "./Controls.module.scss"
import {useEffect, useRef, useState} from "react"

export default function Controls(){
    let currentGroupId = useRef(1)
    const [polygons, setPolygons] = usePolygons()
    const currentGroup = polygons.find(group => group.id === currentGroupId.current)

    const { camera } = useThree()

    const handleMouseClick = (event: React.MouseEvent<HTMLElement>) => {
        // Get the click coordinates relative to the canvas
        const x = event.clientX
        const y = event.clientY

        // Get the canvas size
        const canvasWidth = window.innerWidth
        const canvasHeight = window.innerHeight

        // Calculate the mouse position in normalized device coordinates (NDC)
        const mouseNDC = new Vector3(
            (x / canvasWidth) * 2 - 1,
            -(y / canvasHeight) * 2 + 1,
            0.5 // Depth, assuming objects are at depth 0
        )

        // Convert the mouse position from NDC to world coordinates
        mouseNDC.unproject(camera)

        // Get the direction from the camera to the mouse position
        const direction = mouseNDC.sub(camera.position).normalize()

        // Define a distance from the camera to place the new vertex
        const distance = 10 // Adjust this distance as needed

        // Calculate the final position of the new vertex
        const finalPosition = camera.position.clone().add(direction.multiplyScalar(distance))

        // Add the new vertex to the vertices array
        if(currentGroup){
            setPolygons(prevPolygons => {
                const newPolygons = prevPolygons.map(group => {
                    if(group.id === currentGroupId.current){
                        group.vertices = [...group.vertices, finalPosition]
                    }
                    return group
                })
                return newPolygons
            })
        }
    }

    const deleteLastVertex = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setPolygons(prevPolygons => {
            const newPolygons = prevPolygons.map(group => {
                if(group.id === currentGroupId.current){
                    group.vertices.pop()
                }
                return group
            })
            return newPolygons
        })
    }

    const deleteLastGroup = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        if(currentGroupId.current === 1){
            setPolygons([{...DEFAULT_POLYGON, vertices:[]}])
        }else{
            setPolygons(prevPolygons => {
                const newPolygons = prevPolygons.filter(group => group.id !== currentGroupId.current)
                return newPolygons
            })
            currentGroupId.current -= 1
        }
    }

    const deleteAllVertices = (e: any) => {
        setPolygons([{...DEFAULT_POLYGON, vertices:[]}])
        currentGroupId.current = 1
    }

    const createNewGroup = (e: any) => {
        currentGroupId.current += 1
        setPolygons(prevPolygons => {
            const newGroup = {
                id: currentGroupId.current,
                vertices: [],
                color: new Color(Math.random() * 0xffffff),
                position: new Vector3(0, 0, 0)
            }
            return [...prevPolygons, newGroup]
        })
    }

    const changeColorCurrentGroup = (e: any) => {
        const newColor = new Color(Math.random() * 0xffffff);

        // Apply the new color to the current polygon group
        setPolygons(prevPolygons => {
            return prevPolygons.map(group => {
                if (group.id === currentGroupId.current) {
                    return {...group, color: newColor};
                } else {
                    return group;
                }
            });
        });
    }

    const changePositionCurrentGroup = (event: any) => {
        setPolygons(prevPolygons => {
            return prevPolygons.map(group => {
                if (group.id === currentGroupId.current) {
                    const newPosition = group.position.clone();
                    if (event.code === "ArrowRight") newPosition.x += 0.1;
                    if (event.code === "ArrowLeft") newPosition.x -= 0.1;
                    if (event.code === "ArrowUp") newPosition.y += 0.1;
                    if (event.code === "ArrowDown") newPosition.y -= 0.1;
                    return {...group, position: newPosition};
                } else {
                    return group;
                }
            });
        });
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                deleteAllVertices(event)
            }

            if (event.code === "Enter") {
                createNewGroup(event)
            }

            if (event.code === "KeyC") {
                changeColorCurrentGroup(event)
            }

            if (event.code === "ArrowRight" || event.code === "ArrowLeft" || event.code === "ArrowUp" || event.code === "ArrowDown") {
                // Adjust the position of the current polygon group
                changePositionCurrentGroup(event)
            }

            if (event.code === "Delete" || event.code === "Backspace") {
                if (event.shiftKey) {
                    deleteLastGroup(event);
                } else {
                    deleteLastVertex(event);
                }
            }
        }

        // Add event listener for keydown
        window.addEventListener("keydown", handleKeyDown)

        // Cleanup function
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [setPolygons])

    return(
        <Html>
            <div
                className={styles.controls}
                onClick={handleMouseClick}
                tabIndex={0}
            >
                <button onClick={deleteLastVertex}>Delete Last Vertex</button>
                <button onClick={deleteLastGroup}>Delete Last Group</button>
            </div>
        </Html>
    )
}
