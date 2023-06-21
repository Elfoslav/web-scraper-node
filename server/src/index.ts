import express, { Request, Response } from 'express';
import cors from 'cors';
import { FlatsScraper } from './webScraper/FlatsScraper';
import { FlatsRepository } from './database/FlatsRepository';

const flatsRepository = new FlatsRepository();
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

(async () => {
  try {
    const flatsCount = await flatsRepository.getFlatsCount();

    console.log('flats count:', flatsCount);
    if (flatsCount === 0) {
      const flatsScraper = new FlatsScraper();
      await flatsScraper.run();
      await flatsRepository.insertFlats(flatsScraper.getFlats());
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();

// Create the server
app.get('/flats', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const pageSize = 10; // Number of flats per page
    const { query } = req;

    const page = parseInt(query.page as string, 10) || 1;
    const flats = await flatsRepository.readFlats(page, pageSize);

    res.end(JSON.stringify(flats));
  } catch (error) {
    console.error('Error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

app.get('/flats/count', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const count = await flatsRepository.getFlatsCount();
    res.end(JSON.stringify(count));
  } catch (error) {
    console.error('Error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
