import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col">

            {/* HERO */}
            <section className="flex flex-col items-center justify-center text-center px-6 py-24">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    AidFlow
                </h1>

                <p className="mt-6 text-lg text-gray-300 max-w-2xl">
                    Smart AI-powered volunteer coordination system that transforms chaotic disaster data into structured action.
                </p>

                <Button
                    className="mt-8 px-8 py-4 text-lg"
                    onClick={() => navigate("/app")}
                >
                    Analyze Situation
                </Button>
            </section>

            {/* HOW IT WORKS */}
            <section className="px-6 py-16 max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold text-center mb-12">
                    How It Works
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        "Input disaster situation",
                        "AI processes and prioritizes needs",
                        "Volunteers are matched instantly",
                    ].map((step, i) => (
                        <div
                            key={i}
                            className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur hover:scale-105 transition"
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                Step {i + 1}
                            </h3>
                            <p className="text-gray-400">{step}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURES */}
            <section className="px-6 py-16 bg-white/5">
                <h2 className="text-3xl font-semibold text-center mb-12">
                    Features
                </h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        "AI-powered need detection",
                        "Priority scoring system",
                        "Smart volunteer matching",
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="p-6 bg-black/40 rounded-xl border border-white/10 hover:bg-black/60 transition"
                        >
                            <p className="text-lg font-medium">{feature}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="text-center py-8 text-gray-500 text-sm">
                © 2026 AidFlow — Built for Social Impact
            </footer>
        </div>
    );
}