import Image from 'next/image';

export default function AboutUs() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">About Us</h1>

            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2 relative">
                    <Image
                        src="/about-us-image.jpg"
                        alt="About Us"
                        width={500}
                        height={300}
                        className="rounded-lg"
                    />
                    <div className="absolute top-4 left-4 w-32 h-32 border-4 border-red-500 rounded-lg"></div>
                </div>

                <div className="w-full md:w-1/2">
                    <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                    <p className="mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <p>
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
            </div>
        </div>
    );
}