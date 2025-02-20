import knex, {Knex} from "knex";

let dbInstance: Knex | null = null;

const createDB = () => {
  if (!dbInstance){
    dbInstance = knex({
      client: process.env.DB_CLIENT || "postgresql",
      connection: {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "gamelol1",
        database: process.env.DB_POSTGRES || "postgres",
      },
    })
  }
  return dbInstance;
}

export const connectDb = async (): Promise<Knex> => {
  try {
    const db = createDB();
    await db.raw("SELECT 1");
    console.log("db connected");
    return db;
  } catch (error) {
    console.error("error connecting to DB", error);
    process.exit(1)
  }
};

export const db = createDB();
