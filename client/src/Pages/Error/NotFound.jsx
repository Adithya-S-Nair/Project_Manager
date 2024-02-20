import React from 'react'

const NotFound = () => {
    return (
        <section class="bg-gray-100 h-screen flex items-center">
            <div class="container mx-auto">
                <div class="flex justify-center items-center h-full">
                    <div class="w-full md:w-8/12 lg:w-6/12 xl:w-4/12 text-center">
                        <div class="bg-white p-8 rounded-lg shadow-md">
                            <h1 class="text-6xl text-gray-700">404</h1>

                            <div class="mt-8">
                                <h3 class="text-3xl font-semibold">Looks like you're lost</h3>
                                <p class="text-gray-600">The page you are looking for is not available!</p>

                                <a href="/" class="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">Go to Home</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NotFound