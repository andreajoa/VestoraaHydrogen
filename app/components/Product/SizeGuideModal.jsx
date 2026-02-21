import { useEffect } from 'react';

const sizeData = [
  { size: 'XS', au: '6',  us: '2',  uk: '6',  eu: '34', bust: '83', waist: '63', hips: '88' },
  { size: 'S',  au: '8',  us: '4',  uk: '8',  eu: '36', bust: '87', waist: '67', hips: '92' },
  { size: 'M',  au: '10', us: '6',  uk: '10', eu: '38', bust: '92', waist: '72', hips: '97' },
  { size: 'L',  au: '12', us: '8',  uk: '12', eu: '40', bust: '97', waist: '77', hips: '102' },
  { size: 'XL', au: '14', us: '10', uk: '14', eu: '42', bust: '102', waist: '82', hips: '107' },
  { size: 'XXL',au: '16', us: '12', uk: '16', eu: '44', bust: '107', waist: '87', hips: '112' },
];

export function SizeGuideModal({ isOpen, onClose }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white w-full md:max-w-2xl md:mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-gray-900">Size Guide</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-xl font-light">✕</button>
        </div>
        <div className="px-6 py-6">
          <p className="text-sm text-gray-500 mb-6">All measurements are in centimetres (cm). If between sizes, we recommend sizing up.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center">
              <thead>
                <tr className="bg-gray-900 text-white">
                  {['SIZE','AU','US','UK','EU','BUST (cm)','WAIST (cm)','HIPS (cm)'].map(h => (
                    <th key={h} className="py-3 px-2 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeData.map((row, i) => (
                  <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-2 font-semibold text-gray-900">{row.size}</td>
                    <td className="py-3 px-2 text-gray-600">{row.au}</td>
                    <td className="py-3 px-2 text-gray-600">{row.us}</td>
                    <td className="py-3 px-2 text-gray-600">{row.uk}</td>
                    <td className="py-3 px-2 text-gray-600">{row.eu}</td>
                    <td className="py-3 px-2 text-gray-600">{row.bust}</td>
                    <td className="py-3 px-2 text-gray-600">{row.waist}</td>
                    <td className="py-3 px-2 text-gray-600">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
