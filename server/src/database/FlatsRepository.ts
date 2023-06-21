import pgPromise from "pg-promise";
import dotenv from "dotenv";
import Flat from "../models/Flat";
dotenv.config();

export class FlatsRepository {
  private pgp: pgPromise.IMain<{}>
  private db: pgPromise.IDatabase<{}>;

  constructor() {
    this.pgp = pgPromise();
    this.db = this.pgp({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      database: process.env.DB_DATABASE,
    });
  }

  async insertFlats(flats: Flat[]): Promise<void> {
    try {
      const { ColumnSet } = this.pgp.helpers;
      const cs = new ColumnSet(["title", "locality", "price", "images"], {
        table: "flats",
      });
      const values = flats.map((flat) => ({
        title: flat.title,
        locality: flat.locality,
        price: flat.price,
        images: flat.images
      }));

      if (values.length) {
        const query = this.pgp.helpers.insert(values, cs);
        await this.db.none(query);

        console.log("Flats inserted successfully.");
      }
    } catch (error) {
      console.error("Error inserting flats:", error);
    }
  }

  async getFlatsCount(): Promise<number> {
    try {
      const result = await this.db.one("SELECT COUNT(*) FROM flats");
      const count = parseInt(result.count, 10); // Parse the count value as an integer
      return count;
    } catch (error) {
      console.error("Error getting flats count:", error);
      return 0;
    }
  }

  async readFlats(page: number, pageSize: number): Promise<Flat[]> {
    try {
      const offset = (page - 1) * pageSize;

      const flats = await this.db.any("SELECT * FROM flats OFFSET $1 LIMIT $2", [offset, pageSize]);
      console.log("read flats from db: ", flats.length);
      return flats as Flat[];
    } catch (error) {
      console.error("Error reading flats:", error);
      return [];
    }
  }
}
