const MaterialsTransactionView = () => {
    return (
        <div className="rounded-2xl mt-40 bg-gray-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <svg
                        className="w-32 h-32 mx-auto text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Coming Soon!
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    This page is under construction. We're working hard to bring
                    you an amazing experience. Stay tuned!
                </p>

                <a
                    href="/home"
                    className="inline-block bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Back to Home
                </a>
            </div>
        </div>
    )
}

export default MaterialsTransactionView
