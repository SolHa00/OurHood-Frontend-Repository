import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import RoomCard from '../components/room/RoomCard';
import { RoomCardInfo } from '../types/room';
import { useNavigate } from 'react-router-dom';
import { SearchParams } from '../types/apis/room';
import { IoIosSearch } from 'react-icons/io';
import { searchRooms } from '../api/roomApi';

type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    q: '',
    condition: 'room',
    order: 'date_desc',
  });
  const {
    isLoading,
    error,
    data: rooms,
  } = useQuery({
    queryKey: ['rooms', searchParams],
    queryFn: () => searchRooms(searchParams),
  });

  const handleChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {};
  return (
    <section className='min-h-screen px-1 w-full'>
      <div className='mt-2 mb-4 flex justify-between items-center'>
        <form onSubmit={handleSubmit} className='flex-1 flex gap-2'>
          <select
            name='condition'
            id='condition'
            value={searchParams.condition}
            onChange={handleChange}
            className='p-1 text-sm border rounded border-lightGray'
          >
            <option value='room'>Room</option>
            <option value='host'>Host</option>
          </select>
          <input
            type='text'
            name='q'
            id='q'
            value={searchParams.q}
            onChange={handleChange}
            placeholder='Search...'
            className='py-1 px-2 w-1/4 min-w-40 font-normal outline-none border-b'
          />
          <button type='submit'>
            <IoIosSearch className='text-xl font-bold' />
          </button>
        </form>
        <button
          onClick={() => navigate('/rooms/new')}
          className='h-10 px-2 py-1 rounded-lg text-white bg-brand'
        >
          + Create Room
        </button>
      </div>
      {error && <p>Fetch data error: {error.message}</p>}
      {isLoading && <p>Loading...</p>}
      {rooms && (
        <ul className='w-full gap-x-4 gap-y-8 place-items-center grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
          {rooms.map((roomCardInfo: RoomCardInfo) => (
            <RoomCard
              key={roomCardInfo.roomMetadata.roomId}
              roomCardInfo={roomCardInfo}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default Rooms;
