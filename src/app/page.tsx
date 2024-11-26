"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-100 to-orange-200 text-black animate-gradient-rotate y-10">
      <nav className="flex items-center justify-between p-5 bg-yellow-200 shadow-lg shadow-black-500">
      <ul className="flex space-x-4">
        <li>
        <button 
          className="text-black font-bold cursor-pointer" 
          onClick={() => window.location.href = '/'}
        >
          <Image src="/roomylogo.png" alt="Roomy Logo" width={50} height={50} />
        </button>
        </li>
      </ul>
      <ul className="flex space-x-4 ml-auto">
        <li><a href="/#about" className="text-black font-bold">About</a></li>
        <li><a href="/#contact" className="text-black font-bold">Contact</a></li>
      </ul>
      </nav>
      
      <div className="flex justify-center py-7">
        <Image src="/roomylogomain.png" alt="Roomy Logo" width={500} height={500} />
      </div>
      <h1 className="text-5xl font-extrabold text-center py-5">Select your role:</h1>
      <div className="button-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
        <button 
          className="button text-3xl font-extrabold text-center py-5 border-2 border-yellow-400 hover:bg-amber-200 rounded-lg mb-3 px-10 w-full max-w-xs" 
          onClick={() => window.location.href = '/student'}
        >
          Student
        </button>
        <button 
          className="button text-3xl font-extrabold text-center py-5 border-2 border-yellow-400 hover:bg-amber-200 rounded-lg mb-3 px-10 w-full max-w-xs" 
          onClick={() => window.location.href = '/faculty'}
        >
          Faculty
        </button>
        <button 
          className="button text-3xl font-extrabold text-center py-5 border-2 border-yellow-400 hover:bg-amber-200 rounded-lg mb-3 px-10 w-full max-w-xs" 
          onClick={() => window.location.href = '/admin'}
        >
          Admin
        </button>
      </div>

      <div id="about" className="flex flex-col items-center text-center py-20">
        <div className="border-2 border-yellow-400 shadow-lg shadow-black-500 p-10 px-20 rounded-lg">
          <h2 className="text-4xl font-bold mb-5">About Roomy</h2>
          <p className="text-lg max-w-2xl text-center">
        Roomy is a platform designed to help students, faculty, and administrators manage room bookings efficiently. 
        Whether you need to reserve a study room, a lecture hall, or an event space, Roomy makes the process simple and hassle-free. 
        Our goal is to streamline room management and ensure that everyone has access to the spaces they need, when they need them.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 w-full max-w-4xl">
          <div className="p-10">
            <h3 className="text-3xl font-bold mb-3">Navraj Singh</h3>
            <p className="text-lg">
            Navraj Singh is a passionate software developer with a keen interest in building user-friendly applications. With a background in computer science, Navraj has worked on various projects that aim to simplify complex processes and enhance user experiences.
            </p>
          </div>
          <div className="p-10">
            <h3 className="text-3xl font-bold mb-3">Anmolak Singh</h3>
            <p className="text-lg">
            Anmolak Singh is a dedicated developer who specializes in creating efficient and scalable software solutions. With a strong foundation in software engineering, Anmolak has contributed to numerous projects that focus on improving productivity and streamlining operations.
            </p>
          </div>
        </div>
        <div id="contact" className="flex flex-col items-center text-center py-20">
          <div className="border-2 border-yellow-400 shadow-lg shadow-black-500 p-10 px-20 rounded-lg">
            <h2 className="text-4xl font-bold mb-5">Contact Us</h2>
            <p className="text-lg max-w-2xl text-center">
              You can reach us on GitHub:
            </p>
            <div className="flex space-x-4 mt-5">
              <a href="https://github.com/navraj213" className="text-black font-bold hover:underline">
          Navraj Singh
              </a>
              <a href="https://github.com/anmolak21" className="text-black font-bold hover:underline">
          Anmolak Singh
              </a>
            </div>
          </div>
        </div>

      </div>
      <div style={{ height: '20vh' }}></div>
    </div>
  );
}
