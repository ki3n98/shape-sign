const people = [
    {
        name: 'Hoang Khoi Do',
        role: 'Frontend Developer',
        imageUrl:
            '/Khoi.jpeg'
    },
    {
        name: 'Jason Tran',
        role: 'Frontend Developer',
        imageUrl:
            '/Jason.jpeg'
    },
    {
        name: "Syn Nguyen",
        role: 'Backend Developer',
        imageUrl:
            '/Syn.jpg'
    },
    {
        name: "Kien Pham",
        role: 'Backend Developer',
        imageUrl:
            '/Kien.jpg'
    }
]

export default function TeamSection() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
                <div className="max-w-xl">
                    <h2 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
                        Who are we?
                    </h2>
                    <p className="mt-6 text-lg/8 text-gray-600">
                    We are a team of Computer Science students from CSULB with a strong passion for coding, problem-solving, and innovation. Our dedication lies in developing efficient and creative solutions, continuously improving our skills, and tackling complex challenges. With a commitment to collaboration and learning, we strive to push the boundaries of technology and create meaningful impact through our work.
                    </p>
                </div>
                <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                    {people.map((person) => (
                        <li key={person.name}>
                            <div className="flex items-center gap-x-6">
                                <img alt="" src={person.imageUrl} className="size-20 rounded-full object-scale-down" />
                                <div>
                                    <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">{person.name}</h3>
                                    <p className="text-sm/6 font-semibold text-indigo-600">{person.role}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
