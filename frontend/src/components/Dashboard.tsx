'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import NeuralGraph to avoid SSR issues with Three.js
const NeuralGraph = dynamic(() => import('./NeuralGraph'), { ssr: false });

// Typewriter effect component for text streaming simulation
const Typewriter = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Reset on new text
        let i = 0;
        const speed = 15; // ms per char
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text]);

    return <p className="leading-relaxed text-gray-300 font-mono text-sm shadow-inner">{displayedText}</p>;
};

// Skeleton Loader Component
const BrainSkeleton = () => (
    <div className="w-full h-[400px] bg-black/50 border border-border flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <div className="text-primary font-mono text-sm">NEURO-SYNC // SCANNING KNOWLEDGE BASE...</div>
    </div>
);

export default function Dashboard() {
    const [query, setQuery] = useState('');
    const [persona, setPersona] = useState<'Patient' | 'Researcher'>('Researcher');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setResult(null); // Clear previous
        // Simulate latency (Optimistic UI - Flaw 3)

        setTimeout(() => {
            // Mock Response data
            const isLowConfidence = query.length < 10; // Simple mock trigger for Flaw 1

            if (isLowConfidence) {
                setResult({
                    error: true,
                    text: "⚠️ I cannot find sufficient peer-reviewed data to clarify specific pathways in this text. (Confidence Score: 0.1)",
                    graphData: { nodes: [], edges: [] }
                });
            } else {
                setResult({
                    text: persona === 'Patient'
                        ? "Imagine the brain like a busy city. The 'Amygdala' is the alarm system, and right now it's sending a lot of signals to the 'Hippocampus' (the memory center). This connection helps you remember why you felt scared."
                        : "Analysis of the input text indicates a significant upregulation in the Amygdala-Hippocampal pathway. Metadata extraction confirms strong excitability (Weight: 0.85).",
                    graphData: {
                        nodes: [
                            { id: "Amygdala", region_name: "Amygdala" },
                            { id: "Hippocampus", region_name: "Hippocampus" },
                            { id: "PFC", region_name: "Prefrontal Cortex" },
                            { id: "Thalamus", region_name: "Thalamus" },
                            { id: "ACC", region_name: "Anterior Cingulate" }
                        ],
                        edges: [
                            { source: "Amygdala", target: "Hippocampus" },
                            { source: "Hippocampus", target: "PFC" },
                            { source: "Amygdala", target: "Thalamus" },
                            { source: "ACC", target: "PFC" }
                        ]
                    }
                });
            }
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="noir-container max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                    Neuro-Sync <span className="text-primary">AI</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Advanced Neural Pathway Visualization & Insight Engine.
                    Powered by DigitalOcean Gradient™.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls Section */}
                <div className="noir-card space-y-6 h-fit">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Persona Mode</label>
                        <div className="flex border border-border">
                            <button
                                onClick={() => setPersona('Patient')}
                                className={`flex-1 py-2 text-sm transition-colors ${persona === 'Patient' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'
                                    }`}
                            >
                                Patient
                            </button>
                            <button
                                onClick={() => setPersona('Researcher')}
                                className={`flex-1 py-2 text-sm transition-colors ${persona === 'Researcher' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'
                                    }`}
                            >
                                Researcher
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Clinical Text / Query</label>
                        <textarea
                            className="noir-input h-32 py-2 resize-none bg-black/50"
                            placeholder="Paste clinical notes or research abstract..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Try extracting: "Amygdala connectivity to Hippocampus..."
                        </p>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !query}
                        className="noir-button w-full"
                    >
                        {loading ? 'Processing...' : 'Analyze Pathways'}
                    </button>
                </div>

                {/* Visualization & Results Section */}
                <div className="lg:col-span-2 space-y-6">

                    {loading ? (
                        <BrainSkeleton />
                    ) : result ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* 3D Graph */}
                            <div className="noir-card bg-black border-primary/20 p-0 overflow-hidden relative">
                                <div className="absolute top-0 left-0 bg-primary/20 px-3 py-1 text-xs text-primary font-mono uppercase tracking-widest z-10">
                                    {result.error ? "No Signal" : "Neural Connectivity Map (Live)"}
                                </div>
                                {result.error ? (
                                    <div className="w-full h-[400px] flex items-center justify-center text-red-500 font-mono">
                                        DATA INSUFFICIENT
                                    </div>
                                ) : (
                                    <NeuralGraph data={result.graphData} />
                                )}
                            </div>

                            {/* Analysis Text */}
                            <div className="noir-card border-t-4 border-t-primary">
                                <h3 className="text-lg font-medium mb-2 flex justify-between items-center">
                                    <span>Analysis ({persona})</span>
                                    {!result.error && <span className="text-xs text-primary border border-primary px-2 py-0.5 rounded-full">Confidence: 0.95</span>}
                                </h3>
                                <Typewriter text={result.text} />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-border p-12 text-muted-foreground bg-black/20">
                            <div className="text-6xl mb-4 opacity-20">🧠</div>
                            <p>Ready to ingest clinical data.</p>
                            <p className="text-sm opacity-50">Secure In-Memory Processing</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
