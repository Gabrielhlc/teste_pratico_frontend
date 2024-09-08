'use client';

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  function handleList() {
    router.push('/users/list');
  }

  return (
    <div className="container flex flex-col bg-backgroundList p-3 w-[10%] rounded-lg">
      <button onClick={handleList} className="btn btn-primary text-white">Go to Users' List</button>
    </div>
  );
}