import { RingLoader } from 'react-spinners';

export function Loading({ size, color }) {
  return (
    <>
      <RingLoader
        color={`${color}`}
        size={`${size}`}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </>
  );
}
