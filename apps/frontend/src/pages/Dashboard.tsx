import { useAuth } from "../context/AuthContext";

function Dashboard() {
    
    const { user, logout } = useAuth();

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <header className="border-b border-zinc-800">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <h1 className="text-xl font-bold">
                        AI Knowledge Hub
                    </h1>

                    <button
                        onClick={logout}
                        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition hover:bg-zinc-900"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 py-12">
                <h2 className="text-3xl font-bold">
                    Welcome, {user?.name}
                </h2>

                <p className="mt-2 text-zinc-400">
                    Your knowledge base starts here.
                </p>
            </section>
        </main>
    );
}

export default Dashboard;