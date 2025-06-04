import logo from "../../assets/Logo/logoParanomFleurBlack.png"

export const UiFooter = ({title}) => {
    return (
        <footer className="pt-10">
            <div className="container px-6 py-8 mx-auto">
                <div className="flex flex-col items-center text-center">
                    <a href="#">
                        <img className="w-auto h-7" src={logo} alt=""/>
                    </a>

                    <p className="max-w-md mx-auto mt-4 text-gray-500 dark:text-gray-400">{title}</p>

                    <div className="flex flex-col mt-4 sm:flex-row sm:items-center sm:justify-center">
                        <button
                            className="flex items-center justify-center order-1 w-full px-2 py-2 mt-3 text-sm tracking-wide text-gray-600 capitalize transition-colors duration-300 transform border rounded-md sm:mx-2 dark:border-gray-400 dark:text-gray-300 sm:mt-0 sm:w-auto hover:bg-gray-50 focus:outline-none focus:ring dark:hover:bg-gray-800 focus:ring-gray-300 focus:ring-opacity-40">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h- fill-current"
                                style={{ color: "#E1306C" }}
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>

                            <span className="mx-1">Instagram</span>
                        </button>

                        <button
                            className="flex bg-blue-300 items-center justify-center order-1 w-full px-2 py-2 mt-3 text-sm tracking-wide text-gray-600 capitalize transition-colors duration-300 transform border rounded-md sm:mx-2 dark:border-gray-400 dark:text-gray-300 sm:mt-0 sm:w-auto hover:bg-gray-50 focus:outline-none focus:ring dark:hover:bg-gray-800 focus:ring-gray-300 focus:ring-opacity-40">
                            <svg className="w-4 h- fill-current" role="img" xmlns="http://www.w3.org/2000/svg"
                                 style={{ color: "#1DA1F2" }}
                                 viewBox="0 0 24 24">
                                <path
                                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>

                            <span className="mx-1">Twitter</span>
                        </button>

                    </div>
                </div>

                <hr className="my-10 border-gray-200 dark:border-gray-700"/>

                <div className="flex flex-col items-center sm:flex-row sm:justify-between">
                    <p className="text-sm text-gray-500">© Copyright 2023. All Rights Reserved.</p>

                    <div className="flex mt-3 -mx-2 sm:mt-0">
                        <a href="#"
                           className="mx-2 text-sm text-gray-500 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300"
                           aria-label="Reddit"> Teams </a>

                        <a href="#"
                           className="mx-2 text-sm text-gray-500 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300"
                           aria-label="Reddit"> Privacy </a>

                        <a href="#"
                           className="mx-2 text-sm text-gray-500 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300"
                           aria-label="Reddit"> Cookies </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}