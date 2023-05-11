import React from 'react'
import Error from "../../assets/404error.png"

const UnauthorizedPage = () => {
  return (
    <div class="grid h-screen px-4 bg-white place-content-center">
      <div class="text-center">
        <img src={Error} alt="error" className='h-96 w-96' />

        <h1
          class="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        >
          Uh-oh!
        </h1>

        <p class="mt-4 text-gray-500">Maaf kamu tidak punya akses untuk membuka halaman ini.</p>
      </div>
    </div>

  )
}

export default UnauthorizedPage