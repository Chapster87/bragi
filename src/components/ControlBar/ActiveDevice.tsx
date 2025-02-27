import { CirclePlay } from 'lucide-react';

export default function ActiveDevice({ device }) {

  return (
    <div className="flex items-center justify-end bg-green rounded p-0.75 mt-2 text-black">
      <div className="flex items-center font-bold mr-1"><CirclePlay className="mr-1" /> Playing on {device.name}</div>
    </div>
  )
}