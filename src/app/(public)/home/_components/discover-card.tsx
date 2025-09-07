type CardProps = {
    title: string;
    description: string;
  };
  
  export default function DiscoverCard({ title, description }: CardProps) {
    return (
      <div className="flex flex-col items-center text-center p-6">
        {/* Icon Placeholder */}
        <div className="w-10 h-10 flex items-center justify-center mb-4 bg-gray-200 rounded-full">
          <span className="text-lg">⬢</span> 
          {/* TODO - USE ICON */}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
    );
  }
  