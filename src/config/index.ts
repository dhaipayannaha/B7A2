import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    database:{
        connectionString: process.env.CONNECTIONSTRING as string,
        port: Number(process.env.PORT),
        secret: process.env.JWT_SECRET as string,
    }
}

export default config;