import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
    Terminal,
    Search,
} from "lucide-react";
import { useState } from "react";
import { usePaginatedMachines } from "@/hooks/usePaginatedMachines";
import LoginModal from "@/components/LoginModal";
import MachineDetailsModal from "@/components/MachineDetailsModal";
import { MachineCard } from "@/components/MachineCard";
import { Machine } from "@/hooks/useMachines";
import { CARD_CONFIG } from "@/constants/uiConfig";

const TECHNIQUES = [
    "All",
    "Web Exploitation",
    "Privilege Escalation",
    "Reverse Engineering",
    "Active Directory",
    "Cryptography",
];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard", "Insane"];
const OS_OPTIONS = ["All", "Linux", "Windows", "macOS", "IoT"];

export default function Machines() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");
    const [selectedOS, setSelectedOS] = useState("All");
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    const pageSize = 30;

    const { machines, loading, totalCount } = usePaginatedMachines({
        page: currentPage,
        pageSize,
        searchQuery,
        filters: {
            difficulty: selectedDifficulty,
            os: selectedOS,
            status: selectedStatus
        }
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleMachineClick = (machine: Machine) => {
        setSelectedMachine(machine);
        setDetailsModalOpen(true);
    };

    return (
        <Layout onLoginClick={() => setLoginModalOpen(true)}>
            <div className="pt-24 pb-12 min-h-screen">
                <div className={`${CARD_CONFIG.containerClass} mx-auto space-y-8`}>

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-primary/30 pb-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-widest">
                                <Terminal className="w-4 h-4" />
                                <span>/ home / machines</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                                <span className="glow-text">MÁQUINAS</span>
                            </h1>
                            <p className="text-foreground/70 font-mono max-w-2xl">
                                Accede a nuestra base de datos completa de máquinas activas y retiradas.
                                Practica tus habilidades en entornos controlados.
                            </p>
                        </div>

                        <div className="font-mono text-right hidden md:block">
                            <div className="text-2xl font-bold text-primary">{totalCount}</div>
                            <div className="text-xs text-foreground/50 uppercase tracking-widest">Total Máquinas</div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="glow-box p-6 border-primary/30 neon-border rounded-sm space-y-6">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-primary/50" />
                            <input
                                type="text"
                                placeholder="$ buscar por nombre..."
                                className="w-full bg-background border border-primary/30 rounded-sm pl-12 pr-4 py-3 text-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            />
                        </div>

                        {/* Filter Groups */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary/70 uppercase tracking-widest">
                                    $ estado
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {["All", "Active", "Retired"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => { setSelectedStatus(status); setCurrentPage(1); }}
                                            className={`px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-all border ${selectedStatus === status
                                                ? "bg-primary text-background border-primary font-bold shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                                                : "bg-transparent border-primary/30 text-foreground/70 hover:border-primary hover:text-primary"
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-secondary/70 uppercase tracking-widest">
                                    $ dificultad
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {DIFFICULTIES.map((diff) => (
                                        <button
                                            key={diff}
                                            onClick={() => { setSelectedDifficulty(diff); setCurrentPage(1); }}
                                            className={`px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-all border ${selectedDifficulty === diff
                                                ? "bg-secondary text-background border-secondary font-bold shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                                                : "bg-transparent border-secondary/30 text-foreground/70 hover:border-secondary hover:text-secondary"
                                                }`}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* OS */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-accent/70 uppercase tracking-widest">
                                    $ sistema operativo
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {OS_OPTIONS.map((os) => (
                                        <button
                                            key={os}
                                            onClick={() => { setSelectedOS(os); setCurrentPage(1); }}
                                            className={`px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-all border ${selectedOS === os
                                                ? "bg-accent text-background border-accent font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                                                : "bg-transparent border-accent/30 text-foreground/70 hover:border-accent hover:text-accent"
                                                }`}
                                        >
                                            {os}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Results */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="h-96 flex flex-col items-center justify-center space-y-4 text-primary font-mono animate-pulse">
                                <Terminal className="w-12 h-12" />
                                <div className="text-xl">Cargando base de datos...</div>
                                <div className="text-sm text-primary/50">Accediendo al mainframe</div>
                            </div>
                        ) : (
                            <>
                                <div className={`grid ${CARD_CONFIG.gridCols} gap-6`}>
                                    {machines.map((machine) => (
                                        <MachineCard
                                            key={machine.id}
                                            machine={machine}
                                            onClick={handleMachineClick}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 pt-8 font-mono">
                                        <Button
                                            variant="outline"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="neon-border disabled:opacity-50 hover:bg-primary/10"
                                        >
                                            &lt; PREV
                                        </Button>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-card border border-primary/30 rounded-sm">
                                            <span className="text-primary font-bold">{currentPage}</span>
                                            <span className="text-foreground/50">/</span>
                                            <span className="text-foreground/70">{totalPages}</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="neon-border disabled:opacity-50 hover:bg-primary/10"
                                        >
                                            NEXT &gt;
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div >


            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />
            <MachineDetailsModal
                isOpen={detailsModalOpen}
                machine={selectedMachine}
                onClose={() => setDetailsModalOpen(false)}
            />
        </Layout >
    );
}
