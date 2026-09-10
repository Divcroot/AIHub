import dns from 'dns';
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

const startServer = async (): Promise<void> => {
    await connectDatabase();

    app.listen(env.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    });
};

startServer();