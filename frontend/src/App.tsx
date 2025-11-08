import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


function App() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-4">
        Hello Tailwind CSS v4!
      </h1>
      <p className="text-lg text-center">
        If you see a gradient background, Tailwind v4 is working!
      </p>
      <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        Test Button
      </button>
    </div>
  )
}

export default App
