import * as db from "./database/index";
import { server } from "./api/server";

async function run() {
    await db.connect("crud_dev}");
    const { url } = await server.listen();
    console.log(`🚀 Server ready at ${url}`);
}

run();
