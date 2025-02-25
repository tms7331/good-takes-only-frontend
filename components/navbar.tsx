import Link from "next/link"

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-blue-900 dark:text-blue-100">
                            Good Takes Only
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        <Link
                            href="/submit"
                            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Submit Take
                        </Link>
                        <Link
                            href="/cast"
                            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Create Cast
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

