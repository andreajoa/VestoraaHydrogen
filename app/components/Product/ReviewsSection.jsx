import { useState } from 'react';

const AUTHORS = [
  { name: 'Sophie T.', country: 'Australia', flag: '🇦🇺' },
  { name: 'Emma R.', country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Isabella M.', country: 'United States', flag: '🇺🇸' },
  { name: 'Charlotte B.', country: 'Canada', flag: '🇨🇦' },
  { name: 'Olivia S.', country: 'New Zealand', flag: '🇳🇿' },
  { name: 'Amelia K.', country: 'Germany', flag: '🇩🇪' },
  { name: 'Mia W.', country: 'France', flag: '🇫🇷' },
  { name: 'Chloe P.', country: 'Singapore', flag: '🇸🇬' },
  { name: 'Zoe L.', country: 'Netherlands', flag: '🇳🇱' },
  { name: 'Hannah J.', country: 'Ireland', flag: '🇮🇪' },
];

const TEMPLATES = [
  { title: 'Absolutely love this!', body: 'This is exactly what I was looking for. The quality is amazing and the fit is perfect. Already received so many compliments.' },
  { title: 'Great quality, true to size', body: 'Very happy with this purchase. The fabric feels luxurious and the construction is solid. Fits exactly as described.' },
  { title: 'Beautiful piece, highly recommend', body: 'Stunning quality and the colour is even nicer in person. Shipping was fast. Will definitely order again.' },
  { title: 'Exceeded my expectations', body: 'I was hesitant ordering online but this is incredible. The material feels premium and looks far more expensive than it is.' },
  { title: 'Perfect for work and weekends', body: 'So versatile! Worn to the office and dressed down for weekends. Fabric does not crease which is a huge bonus.' },
  { title: 'Looks exactly like the photos', body: 'No surprises at all. Great value for money and the size chart is accurate. Shipped quickly too.' },
  { title: 'Love the colour and cut', body: 'The colour is gorgeous and the cut is really flattering. I always struggle to find things that fit but this was spot on.' },
  { title: 'Fantastic quality', body: 'Really impressed. You can tell it is well made. The stitching is neat and the fabric is comfortable all day.' },
  { title: 'Would definitely buy again', body: 'This is my second purchase and I am just as happy as the first time. Consistent quality. Highly recommend.' },
  { title: 'Lovely item, great fit', body: 'Really happy with this. Lovely fabric and the fit is great. I ordered my usual size and it was perfect.' },
];

function seededRand(seed, index) {
  const str = seed + String(index);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) / 2147483647;
}

function generateReviews(productId) {
  const count = 8 + Math.floor(seededRand(productId, 99) * 5);
  return Array.from({ length: count }, (_, i) => {
    const r = (n) => seededRand(productId, i * 100 + n);
    const author = AUTHORS[Math.floor(r(1) * AUTHORS.length)];
    const template = TEMPLATES[Math.floor(r(2) * TEMPLATES.length)];
    const ratingRoll = r(4);
    const rating = ratingRoll < 0.08 ? 3 : ratingRoll < 0.25 ? 4 : 5;
    const daysAgo = Math.floor(r(5) * 540);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return {
      id: 'auto-' + productId + '-' + i,
      author: author.name,
      country: author.country,
      flag: author.flag,
      rating,
      date: date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
      title: template.title,
      body: template.body,
      verified: r(6) > 0.1,
    };
  });
}

function Stars({ rating, large }) {
  return (
    <div className={'flex ' + (large ? 'text-xl' : 'text-sm')}>
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
      ))}
    </div>
  );
}

export function ReviewsSection({ productId, productTitle }) {
  const [autoReviews] = useState(() => generateReviews(productId));
  const [customerReviews, setCustomerReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, title: '', body: '' });

  const all = [...customerReviews, ...autoReviews];
  const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.title || !form.body) return;
    const now = new Date();
    setCustomerReviews(prev => [{
      id: 'customer-' + Date.now(),
      author: form.name,
      country: 'Your location',
      flag: '🌍',
      rating: form.rating,
      date: now.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) + ' at ' + now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      title: form.title,
      body: form.body,
      verified: false,
    }, ...prev]);
    setShowForm(false);
    setSubmitted(true);
    setForm({ name: '', rating: 5, title: '', body: '' });
  };

  return (
    <div id="reviews" className="mt-12 pt-10 border-t border-gray-200">
      <h2 className="text-lg font-normal text-gray-900 mb-6">Customer Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 mb-8 pb-8 border-b border-gray-200">
        <div className="text-center md:text-left">
          <div className="text-5xl font-light text-gray-900 leading-none mb-1">{avg.toFixed(1)}</div>
          <Stars rating={Math.round(avg)} large={true} />
          <p className="text-xs text-gray-500 mt-1">{all.length} reviews</p>
        </div>
        <div className="space-y-2">
          {[5,4,3,2,1].map(star => {
            const count = all.filter(r => r.rating === star).length;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-4">{star}</span>
                <span className="text-xs text-yellow-400">★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: (count / all.length * 100) + '%' }} />
                </div>
                <span className="text-xs text-gray-500 w-4">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
      {!showForm && (
        <div className="mb-8">
          {submitted && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-sm text-green-700">Thank you! Your review has been submitted.</div>}
          <button onClick={() => setShowForm(true)} className="border border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
            Write a Review
          </button>
        </div>
      )}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Write Your Review</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
              <input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none" placeholder="Jane D." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setForm(p => ({...p, rating: star}))}
                    className={'text-2xl ' + (star <= form.rating ? 'text-yellow-400' : 'text-gray-300')}>★</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Review Title</label>
              <input required value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none" placeholder="Sum up your experience" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Review</label>
              <textarea required value={form.body} onChange={e => setForm(p => ({...p, body: e.target.value}))}
                rows={4} className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none resize-none"
                placeholder="Tell others what you think..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-gray-900 text-white px-6 py-3 text-sm font-semibold hover:bg-gray-700 transition">Submit Review</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </form>
      )}
      <div className="space-y-6">
        {all.map(review => (
          <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Stars rating={review.rating} large={false} />
                <h4 className="text-sm font-semibold text-gray-900 mt-1">{review.title}</h4>
              </div>
              {review.verified && <span className="text-xs text-green-600 font-medium">Verified Purchase</span>}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs font-medium text-gray-900">{review.author}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">{review.flag} {review.country}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
