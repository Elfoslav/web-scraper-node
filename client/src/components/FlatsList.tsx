import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Flat from '../../../server/src/models/Flat';
import Pagination from './Pagination';
import './FlatsList.css';

const itemsPerPage = 10;

async function fetchFlats(page: number): Promise<Flat[]> {
  const response = await fetch(`http://localhost:3000/flats/?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch flats');
  }
  const data = await response.json();
  return data as Flat[];
}

async function getFlatsCount(): Promise<number> {
  const response = await fetch(`http://localhost:3000/flats/count`);
  if (!response.ok) {
    throw new Error('Failed to fetch flats count');
  }
  const data = await response.json();
  return data as number
}

export default function FlatsList() {
  const [page, setPage] = useState(1);
  const { data: flatsCount = 0 } = useQuery<number>('flatsCount', () => getFlatsCount(), { initialData: 0 });
  const { data: flats, isLoading, error, refetch } = useQuery<Flat[]>('flats', () => fetchFlats(page));
  const pagesTotal = flatsCount && Math.ceil(flatsCount / itemsPerPage);
  console.log('pages total: ', pagesTotal);

  useEffect(() => {
    refetch();
    console.log('Refetch and page:', flats, page);
  }, [page]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching flats: {error.toString()}</div>;
  }

  function onPageChange(page: number) {
    setPage(page);
  }

  return (
    <div className="flats-list">
      <h1 className="mt-0">Byty na prodej</h1>
      {flats?.map((flat) => (
        <div key={flat.id}>
          <div className="flat-images-wrapper">
            {flat.images.map((image) => (
              <img key={image} src={image} alt="Flat" />
            ))}
          </div>
          <h2>{flat.title}</h2>
          <p>Locality: {flat.locality}</p>
          <p>Price: {flat.price}</p>
          <hr className="mb-15" />
        </div>
      ))}
      <Pagination
        page={page}
        totalItems={flatsCount}
        itemsPerPage={itemsPerPage}
        paginate={onPageChange}
      />
    </div>
  );
}
