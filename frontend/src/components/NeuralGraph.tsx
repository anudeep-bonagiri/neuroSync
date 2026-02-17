'use client';

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

// Types for neural data
interface Node {
    id: string;
    position: [number, number, number];
    color: string;
}

interface Edge {
    sourceId: string;
    targetId: string;
    source: [number, number, number];
    target: [number, number, number];
}

const NodeMesh = ({
    position,
    color,
    isDimmed,
    onClick
}: {
    position: [number, number, number];
    color: string;
    isDimmed: boolean;
    onClick: () => void;
}) => {
    return (
        <mesh position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isDimmed ? 0.1 : 0.8}
                transparent
                opacity={isDimmed ? 0.2 : 1}
            />
        </mesh>
    );
};

const EdgeLine = ({ start, end, isDimmed }: { start: [number, number, number]; end: [number, number, number]; isDimmed: boolean }) => {
    return (
        <Line
            points={[start, end]}
            color="#10b981"
            lineWidth={1}
            transparent
            opacity={isDimmed ? 0.05 : 0.4}
        />
    );
};


const BrainGraph = ({ data }: { data: { nodes: any[]; edges: any[] } }) => {
    const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

    // Generate random positions if not present
    const processedNodes = useMemo(() => {
        return data.nodes.map((n, i) => ({
            ...n,
            position: n.position || [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ] as [number, number, number],
            color: i % 2 === 0 ? '#10b981' : '#ffffff'
        })) as Node[];
    }, [data.nodes]);

    const processedEdges = useMemo(() => {
        if (data.edges && data.edges.length > 0) {
            return data.edges.map(e => {
                const source = processedNodes.find(n => n.id === e.source);
                const target = processedNodes.find(n => n.id === e.target);
                if (source && target) {
                    return {
                        sourceId: source.id,
                        targetId: target.id,
                        source: source.position,
                        target: target.position
                    };
                }
                return null;
            }).filter(Boolean) as Edge[];
        }
        return [];
    }, [data.edges, processedNodes]);

    const handleNodeClick = (id: string) => {
        setFocusedNodeId(prev => prev === id ? null : id);
    };

    const isNodeDimmed = (id: string) => {
        if (!focusedNodeId) return false;
        if (id === focusedNodeId) return false;
        // Check if connected
        const isConnected = processedEdges.some(e =>
            (e.sourceId === focusedNodeId && e.targetId === id) ||
            (e.sourceId === id && e.targetId === focusedNodeId)
        );
        return !isConnected;
    };

    const isEdgeDimmed = (edge: Edge) => {
        if (!focusedNodeId) return false;
        return edge.sourceId !== focusedNodeId && edge.targetId !== focusedNodeId;
    };

    return (
        <group>
            {processedNodes.map((node, i) => (
                <NodeMesh
                    key={i}
                    position={node.position}
                    color={node.color}
                    isDimmed={isNodeDimmed(node.id)}
                    onClick={() => handleNodeClick(node.id)}
                />
            ))}
            {processedEdges.map((edge, i) => (
                <EdgeLine
                    key={i}
                    start={edge.source}
                    end={edge.target}
                    isDimmed={isEdgeDimmed(edge)}
                />
            ))}
        </group>
    );
};

const Scene = ({ data }: { data: any }) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <BrainGraph data={data} />
            <OrbitControls autoRotate autoRotateSpeed={0.5} />
        </>
    )
}

export default function NeuralGraph({ data }: { data: any }) {
    return (
        <div className="w-full h-[400px] border border-border bg-black relative">
            <div className='absolute top-4 left-4 z-10 text-xs text-muted-foreground pointer-events-none'>
                {data.nodes.length > 0 ? "Click nodes to focus" : ""}
            </div>
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <Scene data={data} />
            </Canvas>
        </div>
    );
}
