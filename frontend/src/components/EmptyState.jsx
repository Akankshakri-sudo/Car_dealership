import React from 'react';
import { Car, SearchX } from 'lucide-react';

const EmptyState = ({
  title = 'No Vehicles Found',
  description = 'We couldn\'t find any vehicles matching your search criteria. Try resetting your search filters.',
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-slate-800 max-w-lg mx-auto my-8">
      <div className="p-4 bg-slate-800/80 text-slate-400 rounded-full mb-4 border border-slate-700">
        <SearchX className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-sky-600/20"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
