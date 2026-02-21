import { useState, useEffect } from 'react';

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
  { title: 'Absolutely love this!', body: 'This is exactly what I was looking for. The quality is amazing and the fit is perfect. Already received so many compliments.', fit: 3, size: 3, quality: 4, value: 4, imageMatch: 5 },
  { title: 'Great quality, true to size', body: 'Very happy with this purchase. The fabric feels luxurious and the construction is solid. Fits exactly as described.', fit: 2, size: 2, quality: 5, value: 4, imageMatch: 4 },
  { title: 'Beautiful piece, highly recommend', body: 'Stunning quality and the colour is even nicer in person. Shipping was fast. Will definitely order again.', fit: 3, size: 3, quality: 5, value: 5, imageMatch: 5 },
  { title: 'Exceeded my expectations', body: 'I was hesitant ordering online but this is incredible. The material feels premium and looks far more expensive than it is.', fit: 4, size: 3, quality: 5, value: 5, imageMatch: 5 },
  { title: 'Perfect for work and weekends', body: 'So versatile! Worn to the office and dressed down for weekends. Fabric does not crease which is a huge bonus.', fit: 3, size: 2, quality: 4, value: 4, imageMatch: 4 },
  { title: 'Looks exactly like the photos', body: 'No surprises at all. Great value for money and the size chart is accurate. Shipped quickly too.', fit: 3, size: 3, quality: 4, value: 5, imageMatch: 5 },
  { title: 'Love the colour and cut', body: 'The colour is gorgeous and the cut is really flattering. I always struggle to find things that fit but this was spot on.', fit: 2, size: 2, quality: 5, value: 4, imageMatch: 5 },
  { title: 'Fantastic quality', body: 'Really impressed. You can tell it is well made. The stitching is neat and the fabric is comfortable all day.', fit: 3, size: 3, quality: 5, value: 5, imageMatch: 4 },
  { title: 'Would definitely buy again', body: 'This is my second purchase and I am just as happy as the first time. Consistent quality. Highly recommend.', fit: 3, size: 3, quality: 5, value: 4, imageMatch: 4 },
  { title: 'Lovely item, great fit', body: 'Really happy with this. Lovely fabric and the fit is great. I ordered my usual size and it was perfect.', fit: 2, size: 2, quality: 4, value: 4, imageMatch: 5 },
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
    const monthsAgo = Math.round(daysAgo / 30);
    const timeAgo = monthsAgo === 0 ? 'this month' : monthsAgo === 1 ? '1 month ago' : `${monthsAgo} months ago`;
    return {
      id: 'auto-' + productId + '-' + i,
      author: author.name,
      country: author.country,
      flag: author.flag,
      rating,
      date: timeAgo,
      title: template.title,
      body: template.body,
      verified: r(6) > 0.1,
      recommend: r(7) > 0.15,
      helpful: Math.floor(r(8) * 8),
      fit: template.fit,
      size: template.size,
      quality: template.quality,
      value: template.value,
      imageMatch: template.imageMatch,
    };
  });
}

function Stars({ rating, large, interactive, onRate }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          onClick={interactive ? () => onRate(s) : undefined}
          style={{
            fontSize: large ? '22px' : '14px',
            color: s <= rating ? '#C9A84C' : '#e0e0e0',
            cursor: interactive ? 'pointer' : 'default',
            lineHeight: 1,
          }}
        >★</span>
      ))}
    </div>
  );
}

// Slider visual like screenshot: segmented bar
function SegmentedSlider({ value, min = 1, max = 5, leftLabel, rightLabel }) {
  const segments = max - min + 1;
  return (
    <div>
      <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
        {Array.from({ length: segments }, (_, i) => {
          const segVal = min + i;
          const filled = segVal <= value;
          return (
            <div
              key={i}
              style={{
                flex: 1, height: '8px', borderRadius: '2px',
                backgroundColor: filled ? '#C9A84C' : '#e8e8e8',
              }}
            />
          );
        })}
      </div>
      {(leftLabel || rightLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', color: '#888' }}>{leftLabel}</span>
          <span style={{ fontSize: '10px', color: '#888' }}>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

// For Quality/Value: show score on right
function ScoreBar({ value, max = 5 }) {
  const pct = (value / max) * 100;
  const segments = max;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, display: 'flex', gap: '3px' }}>
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1, height: '8px', borderRadius: '2px',
              backgroundColor: (i + 1) <= value ? '#C9A84C' : '#e8e8e8',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', color: '#333', width: '24px', textAlign: 'right' }}>{value.toFixed(1)}</span>
    </div>
  );
}

function ReviewCard({ review }) {
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [voted, setVoted] = useState(null);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '32px', paddingBottom: '28px', borderBottom: '1px solid #f0f0f0', marginBottom: '28px' }}>
      {/* LEFT: review content */}
      <div>
        <Stars rating={review.rating} />
        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111', margin: '8px 0 4px' }}>{review.title}</h4>
        <p style={{ fontSize: '13px', color: '#777', marginBottom: '10px' }}>{review.date}</p>
        <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.6, marginBottom: '12px' }}>{review.body}</p>
        {review.recommend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span style={{ color: '#2a9d5c', fontSize: '14px' }}>✔</span>
            <span style={{ fontSize: '13px', color: '#444' }}>Yes, I recommend this product.</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', color: '#777' }}>Helpful?</span>
          <button
            onClick={() => { if (voted !== 'up') { setHelpful(h => h + 1); setVoted('up'); } }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: voted === 'up' ? '#C9A84C' : '#666' }}
          >
            👍 ({helpful})
          </button>
          <button
            onClick={() => { if (voted !== 'down') { setVoted('down'); } }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: voted === 'down' ? '#999' : '#666' }}
          >
            👎 (0)
          </button>
          <span style={{ fontSize: '12px', color: '#aaa' }}>·</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#666', textDecoration: 'underline' }}>
            Report
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>{review.author}</span>
          <span style={{ fontSize: '11px', color: '#aaa' }}>·</span>
          <span style={{ fontSize: '12px', color: '#666' }}>{review.flag} {review.country}</span>
          {review.verified && (
            <>
              <span style={{ fontSize: '11px', color: '#aaa' }}>·</span>
              <span style={{ fontSize: '11px', color: '#2a9d5c', fontWeight: '600' }}>Verified Purchase</span>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: sliders sidebar */}
      <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '18px 16px', alignSelf: 'start' }}>
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>Fit</p>
          <SegmentedSlider value={review.fit} leftLabel="Tight" rightLabel="Loose" />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>Size</p>
          <SegmentedSlider value={review.size} leftLabel="Runs Small" rightLabel="Runs Large" />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>Quality of Product</p>
          <ScoreBar value={review.quality} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>Value of Product</p>
          <ScoreBar value={review.value} />
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>How well did the product match the images?</p>
          <SegmentedSlider value={review.imageMatch} leftLabel="Not Accurate" rightLabel="Very Accurate" />
        </div>
      </div>
    </div>
  );
}

export function ReviewsSection({ productId, productTitle }) {
  const storageKey = 'vestoraa_reviews_' + productId;
  const [autoReviews] = useState(() => generateReviews(productId));
  const [customerReviews, setCustomerReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, title: '', body: '', recommend: true, fit: 3, size: 3, quality: 4, value: 4, imageMatch: 4 });

  // Load persisted reviews from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setCustomerReviews(stored);
    } catch {}
  }, [storageKey]);

  const all = [...customerReviews, ...autoReviews];
  const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.title || !form.body) return;
    const now = new Date();
    const newReview = {
      id: 'customer-' + Date.now(),
      author: form.name,
      country: 'Your location',
      flag: '🌍',
      rating: form.rating,
      date: 'just now',
      title: form.title,
      body: form.body,
      verified: false,
      recommend: form.recommend,
      helpful: 0,
      fit: form.fit,
      size: form.size,
      quality: form.quality,
      value: form.value,
      imageMatch: form.imageMatch,
    };
    const updated = [newReview, ...customerReviews];
    setCustomerReviews(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
    setShowForm(false);
    setSubmitted(true);
    setForm({ name: '', rating: 5, title: '', body: '', recommend: true, fit: 3, size: 3, quality: 4, value: 4, imageMatch: 4 });
  };

  return (
    <div id="reviews" style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '400', color: '#111', marginBottom: '24px' }}>Customer Reviews</h2>

      {/* Summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #eee' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '52px', fontWeight: '300', color: '#111', lineHeight: 1 }}>{avg.toFixed(1)}</div>
          <Stars rating={Math.round(avg)} large />
          <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{all.length} reviews</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          {[5,4,3,2,1].map(star => {
            const count = all.filter(r => r.rating === star).length;
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#555', width: '8px' }}>{star}</span>
                <span style={{ fontSize: '12px', color: '#C9A84C' }}>★</span>
                <div style={{ flex: 1, backgroundColor: '#eee', borderRadius: '4px', height: '8px' }}>
                  <div style={{ width: `${(count / all.length) * 100}%`, backgroundColor: '#C9A84C', height: '8px', borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#888', width: '16px' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write review button */}
      {!showForm && (
        <div style={{ marginBottom: '32px' }}>
          {submitted && (
            <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: '#f0faf4', border: '1px solid #b7dfca', borderRadius: '6px', fontSize: '13px', color: '#2a9d5c' }}>
              Thank you! Your review has been submitted.
            </div>
          )}
          <button
            onClick={() => setShowForm(true)}
            style={{ border: '1.5px solid #111', padding: '12px 24px', fontSize: '13px', fontWeight: '700', color: '#111', backgroundColor: '#fff', cursor: 'pointer', letterSpacing: '0.05em', borderRadius: '4px', transition: 'all 0.2s' }}
          >
            Write a Review
          </button>
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111', marginBottom: '20px' }}>Write Your Review</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px' }}>Your Name</label>
              <input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} placeholder="Jane D." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '8px' }}>Rating</label>
              <Stars rating={form.rating} interactive onRate={(r) => setForm(p => ({...p, rating: r}))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px' }}>Review Title</label>
              <input required value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
                style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} placeholder="Sum up your experience" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px' }}>Your Review</label>
              <textarea required value={form.body} onChange={e => setForm(p => ({...p, body: e.target.value}))}
                rows={4} style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                placeholder="Tell others what you think..." />
            </div>
            {/* Fit/Size sliders in form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px' }}>Fit (Tight → Loose)</label>
                <input type="range" min="1" max="5" value={form.fit} onChange={e => setForm(p => ({...p, fit: +e.target.value}))} style={{ width: '100%', accentColor: '#C9A84C' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px' }}>Size (Runs Small → Large)</label>
                <input type="range" min="1" max="5" value={form.size} onChange={e => setForm(p => ({...p, size: +e.target.value}))} style={{ width: '100%', accentColor: '#C9A84C' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#444', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.recommend} onChange={e => setForm(p => ({...p, recommend: e.target.checked}))} />
                I recommend this product
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ backgroundColor: '#111', color: '#fff', padding: '12px 24px', fontSize: '13px', fontWeight: '700', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.05em' }}>Submit Review</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ border: '1px solid #ccc', padding: '12px 24px', fontSize: '13px', fontWeight: '600', color: '#555', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* Review list */}
      <div>
        {all.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
