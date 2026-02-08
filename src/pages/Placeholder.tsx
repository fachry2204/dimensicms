import { useLocation } from 'react-router-dom';

interface PlaceholderProps {
  title?: string;
}

const Placeholder = ({ title }: PlaceholderProps) => {
  const location = useLocation();
  const displayTitle = title || location.pathname.split('/').filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' > ');

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{displayTitle}</h1>
      <p className="text-gray-500">This page is under construction.</p>
    </div>
  );
};

export default Placeholder;
