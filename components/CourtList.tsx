export default function CourtList({ courts }: { courts: any[] }) {
    return (
        <div className='w-full h-full'>
            {courts.length === 0 ? (
                <p>No courts found.</p>
            ) : (
                <ul className="space-y-2">
                    {courts.map((court: any) => (
                        <li key={court.id} className="border p-2 rounded">
                            <strong>{court.name}</strong><br />
                            <span className="text-sm text-gray-600">{court.address}, {court.city}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}