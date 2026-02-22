import { useState, useEffect, useMemo } from 'react';

function seededRng(seed) {
  let s = typeof seed === 'string'
    ? seed.split('').reduce((h, c) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0)
    : seed | 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223 | 0;
    return (s >>> 0) / 0xffffffff;
  };
}

const AUTHORS = [
  { name: 'Sophie T.',    country: 'Australia',     flag: '🇦🇺' },
  { name: 'Emma R.',      country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Isabella M.',  country: 'United States',  flag: '🇺🇸' },
  { name: 'Charlotte B.', country: 'Canada',         flag: '🇨🇦' },
  { name: 'Olivia S.',    country: 'New Zealand',    flag: '🇳🇿' },
  { name: 'Amelia K.',    country: 'Germany',        flag: '🇩🇪' },
  { name: 'Mia W.',       country: 'France',         flag: '🇫🇷' },
  { name: 'Chloe P.',     country: 'Singapore',      flag: '🇸🇬' },
  { name: 'Zoe L.',       country: 'Netherlands',    flag: '🇳🇱' },
  { name: 'Hannah J.',    country: 'Ireland',        flag: '🇮🇪' },
  { name: 'Lily C.',      country: 'Australia',      flag: '🇦🇺' },
  { name: 'Grace H.',     country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Aria N.',      country: 'Sweden',         flag: '🇸🇪' },
  { name: 'Luna F.',      country: 'Spain',          flag: '🇪🇸' },
  { name: 'Stella D.',    country: 'Italy',          flag: '🇮🇹' },
  { name: 'Nora V.',      country: 'Belgium',        flag: '🇧🇪' },
  { name: 'Ruby A.',      country: 'Australia',      flag: '🇦🇺' },
  { name: 'Isla G.',      country: 'Scotland',       flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'Freya O.',     country: 'Denmark',        flag: '🇩🇰' },
  { name: 'Piper M.',     country: 'United States',  flag: '🇺🇸' },
  { name: 'Hazel B.',     country: 'Canada',         flag: '🇨🇦' },
  { name: 'Violet C.',    country: 'New Zealand',    flag: '🇳🇿' },
  { name: 'Aurora L.',    country: 'Norway',         flag: '🇳🇴' },
  { name: 'Scarlett R.',  country: 'Australia',      flag: '🇦🇺' },
  { name: 'Penelope W.',  country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Elena S.',     country: 'Portugal',       flag: '🇵🇹' },
  { name: 'Maya T.',      country: 'United States',  flag: '🇺🇸' },
  { name: 'Layla K.',     country: 'UAE',            flag: '🇦🇪' },
  { name: 'Jasmine F.',   country: 'Malaysia',       flag: '🇲🇾' },
  { name: 'Camille D.',   country: 'France',         flag: '🇫🇷' },
];

const TEMPLATES = [
  { title: 'Absolutely love this piece',           body: 'From the moment I put it on I knew this was going to be a favourite. The fabric feels elevated and the fit is exactly right.' },
  { title: 'Better than I expected',               body: 'Honestly was a little unsure ordering online but this exceeded every expectation. The quality is genuinely impressive for the price point.' },
  { title: 'My new go-to for weekends',            body: 'I have already worn this three weekends in a row. It washes beautifully, holds its shape and still looks fresh every time.' },
  { title: 'Compliments every single time',        body: 'Every time I wear this someone asks where it is from. The cut is really flattering and the colour in person is even nicer than the photos.' },
  { title: 'True to size and gorgeous',            body: 'Ordered my usual size and it fits like it was made for me. The fabric drapes beautifully and feels comfortable all day.' },
  { title: 'Exactly what I was looking for',       body: 'I had been searching for something like this for months. The fit, the colour, the fabric — everything is just right.' },
  { title: 'Looks far more expensive than it is',  body: 'The construction is really solid. The stitching is neat, the fabric has weight to it and overall it looks like something from a designer rack.' },
  { title: 'Worn it to work and evenings out',     body: 'This piece does double duty effortlessly. Wore it to a team lunch and then straight to dinner — just changed my shoes and bag.' },
  { title: 'Fabric is really lovely',              body: 'The material is soft and breathable without being thin or cheap feeling. It moves nicely and does not cling in the wrong places.' },
  { title: 'Will be buying more colours',          body: 'Already planning my next order. This is the kind of piece you want in every colour once you feel the quality.' },
  { title: 'Fits like a dream',                    body: 'I am quite petite and often struggle with proportions but this fit perfectly straight out of the bag. No alterations needed.' },
  { title: 'Packaged beautifully, arrived fast',   body: 'Came well packaged and arrived earlier than expected. The item itself is even lovelier in person — really pleased.' },
  { title: 'Colour is stunning in person',         body: 'The colour photographed well but in real life it is even richer and more beautiful. I have had so many compliments already.' },
  { title: 'Great for the office',                 body: 'Smart enough for a professional setting but comfortable enough to wear all day. Exactly the balance I was looking for.' },
  { title: 'Flattering on every body type',        body: 'I was nervous about the cut but it is genuinely flattering. It skims rather than clings and gives a really elegant silhouette.' },
  { title: 'Second purchase, just as happy',       body: 'This is not my first order from Vestoraa and I am just as impressed this time. Consistent quality you can rely on.' },
  { title: 'Does not crease — huge bonus',         body: 'Threw it in a bag for a weekend trip and pulled it out completely crease-free. The fabric is brilliant for travelling.' },
  { title: 'Wears really comfortably all day',     body: 'Wore this for a full day of meetings and felt comfortable the entire time. No pulling, no discomfort — just a great fit.' },
  { title: 'Really versatile piece',               body: 'I have styled this so many different ways already. It works with trainers for a casual look and heels for something more dressed up.' },
  { title: 'Highly recommend to everyone',         body: 'Showed this to my sister and she immediately ordered one too. The quality speaks for itself when you see it in person.' },
  { title: 'Loved everything about it',            body: 'The cut, the fabric, the colour — all perfect. Nothing to fault at all. This is going straight into the regular rotation.' },
  { title: 'A wardrobe essential',                 body: 'This is the kind of piece every wardrobe needs. Understated enough to wear often but special enough to feel intentional.' },
  { title: 'Exceeded my expectations completely',  body: 'I keep my expectations measured when buying online. This blew past them. Really well made and incredibly wearable.' },
  { title: 'Ran true to the size guide',           body: 'I used the size guide and my measurements matched perfectly. Good to know they put effort into accurate sizing information.' },
  { title: 'Looks great in photos and real life',  body: 'No gap between the product photo and what arrived. Exactly as described — refreshing honesty in product imagery.' },
  { title: 'Comfortable from morning to evening',  body: 'Put this on at 7am and was still comfortable wearing it at 10pm. That kind of all-day wearability is hard to find.' },
  { title: 'Perfect weight for the season',        body: 'Not too heavy, not too light. The fabric weight is spot on — breathable but with enough structure to look polished.' },
  { title: 'Makes getting dressed so easy',        body: 'When you have one piece that just works with everything it takes so much stress out of getting dressed. This is that piece.' },
  { title: 'Received so many compliments',         body: 'Wore this to a work event and had multiple people ask where it was from. Always a good sign when that happens.' },
  { title: 'Really glad I took the chance',        body: 'I was hesitant because I had not ordered from here before. Completely glad I did — quality is excellent and delivery was fast.' },
  { title: 'Beautiful drape and movement',         body: 'The way this fabric moves is really lovely. It flows without being flimsy and has a real elegance to the way it sits.' },
  { title: 'Solid construction throughout',        body: 'Checked all the seams and stitching when it arrived — everything is neat and well finished. The kind of quality that lasts.' },
  { title: 'Great value for what you get',         body: 'At this price point you do not usually get this level of finish. Really impressed with the quality relative to cost.' },
  { title: 'Wore it straight out of the bag',      body: 'Arrived with minimal creasing and looked ready to wear immediately. Perfect when you need something for a last-minute occasion.' },
  { title: 'Exactly as described online',          body: 'The product description was accurate and honest. What arrived matched perfectly — no disappointment, no surprises.' },
  { title: 'Perfect for a special occasion',       body: 'Wore this to a wedding reception and felt completely confident. Elegant without trying too hard — exactly the right tone.' },
  { title: 'Will hold up to regular wear',         body: 'You can tell this is built to last. The fabric has quality to it and the construction feels robust rather than disposable.' },
  { title: 'Comfortable fabric all day',           body: 'Some fabrics feel great at first but become uncomfortable after a few hours. This one stayed comfortable from start to finish.' },
  { title: 'Easy to style',                        body: 'One of those pieces that works with half the things already in my wardrobe. Very easy to style without thinking too hard.' },
  { title: 'Lovely piece, fast delivery',          body: 'Item arrived quickly and in perfect condition. The quality is everything I hoped for and more. Very satisfied overall.' },
  { title: 'Feels premium without the price tag',  body: 'The quality genuinely surprised me. It has the feel of something much more expensive without the price tag to match.' },
  { title: 'Great silhouette on',                  body: 'The cut creates a really nice silhouette. It gives shape in the right places without being restrictive or overly fitted.' },
  { title: 'My most-worn piece this month',        body: 'I have reached for this more than anything else in my wardrobe this month. It just works for everything.' },
  { title: 'Colour does not fade after washing',   body: 'Washed this several times now and the colour is still as vibrant as when it arrived. Good dye quality makes a big difference.' },
  { title: 'Feels great against the skin',         body: 'No itching, no scratching, no irritation. Just a really comfortable fabric that sits well all day without any issues.' },
  { title: 'Looks polished without effort',        body: 'One of those rare pieces where you look pulled together without actually trying. That effortless quality is hard to find.' },
  { title: 'Generous sizing, good to know',        body: 'I sized down based on the description and it was the right call. Good to know the size guide is reliable — will use it again.' },
  { title: 'Smart enough for work events',         body: 'Wore this to a corporate function and felt completely appropriate and confident. Professional but still interesting.' },
  { title: 'Loved it from the first wear',         body: 'Some pieces take time to love — this one I liked immediately. Comfortable, flattering, and just really well put together.' },
  { title: 'Impressive quality for online',        body: 'Online shopping can be a gamble with quality but this delivered. Really impressed with the overall standard.' },
  { title: 'Nothing to fault',                     body: 'I genuinely cannot think of a single criticism. Everything from the packaging to the product itself was excellent.' },
  { title: 'Would gift this to a friend',          body: 'This is the kind of quality I would happily give as a gift. It looks and feels like something thoughtfully chosen.' },
  { title: 'A pleasure to wear',                   body: 'Some clothes you wear out of necessity. This one you actually look forward to putting on. That is a real quality indicator.' },
  { title: 'Bought two just in case',              body: 'Loved this so much I ordered a second one in a different colour. Hoping they keep this style in the range permanently.' },
  { title: 'Turned heads at the event',            body: 'Wore this to a dinner and had so many people comment on it. The cut is really striking in person.' },
  { title: 'Well thought out design',              body: 'You can tell this was designed by people who actually think about how clothes are worn. Everything is in the right place.' },
  { title: 'Arrived better than expected',         body: 'The product looked good in the photos but arrived even better in person. Colour, quality and fit all surpassed my expectations.' },
  { title: 'Great everyday piece',                 body: 'This works so well as an everyday piece. Not fussy, does not need special care, and looks great every single time.' },
  { title: 'Elegant and comfortable together',     body: 'Getting both elegance and comfort in one piece is harder than it sounds. This manages it well — a genuinely wearable piece.' },
  { title: 'Quality that is obvious immediately',  body: 'You can tell from the first touch that this is well made. The weight, the finish, the stitching — all reassuringly good.' },
  { title: 'Washed well, held its shape',          body: 'After several washes it still looks exactly as it did when it arrived. The shape has not changed and the colour is still strong.' },
];

function generateReviews(productId) {
  const rng = seededRng(String(productId));
  const count = 12 + Math.floor(rng() * 12);
  const authorPool = [...AUTHORS].sort(() => rng() - 0.5);
  const templatePool = [...TEMPLATES].sort(() => rng() - 0.5).slice(0, count);
  const targetAvg = 4.3 + rng() * 0.7;
  const ratings = Array.from({ length: count }, () => {
    const r = rng();
    if (targetAvg >= 4.8) return r < 0.7 ? 5 : r < 0.95 ? 4 : 3;
    if (targetAvg >= 4.5) return r < 0.5 ? 5 : r < 0.85 ? 4 : 3;
    return r < 0.3 ? 5 : r < 0.75 ? 4 : 3;
  });
  return templatePool.map((template, i) => {
    const author = authorPool[i % authorPool.length];
    const daysAgo = Math.floor(rng() * 540) + 1;
    const monthsAgo = Math.round(daysAgo / 30);
    const timeAgo = monthsAgo === 0 ? 'this month' : monthsAgo === 1 ? '1 month ago' : `${monthsAgo} months ago`;
    return {
      id: `auto-${productId}-${i}`,
      author: author.name,
      country: author.country,
      flag: author.flag,
      rating: ratings[i],
      date: timeAgo,
      title: template.title,
      body: template.body,
      verified: rng() > 0.12,
      recommend: rng() > 0.1,
      helpful: Math.floor(rng() * 10),
      fit: 2 + Math.floor(rng() * 3),
      size: 2 + Math.floor(rng() * 3),
      quality: 4 + Math.floor(rng() * 2),
      value: 3 + Math.floor(rng() * 3),
      imageMatch: 4 + Math.floor(rng() * 2),
    };
  });
}

function Stars({ rating, large, interactive, onRate }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={interactive ? () => onRate(s) : undefined}
          style={{ fontSize: large ? '22px' : '14px', color: s <= rating ? '#C9A84C' : '#e0e0e0', cursor: interactive ? 'pointer' : 'default', lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

function SegmentedSlider({ value, min = 1, max = 5, leftLabel, rightLabel }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <div key={i} style={{ flex: 1, height: '8px', borderRadius: '2px', backgroundColor: (min + i) <= value ? '#C9A84C' : '#e8e8e8' }} />
        ))}
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

function ScoreBar({ value, max = 5 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, display: 'flex', gap: '3px' }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{ flex: 1, height: '8px', borderRadius: '2px', backgroundColor: (i + 1) <= value ? '#C9A84C' : '#e8e8e8' }} />
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
          <button onClick={() => { if (voted !== 'up') { setHelpful(h => h + 1); setVoted('up'); } }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: voted === 'up' ? '#C9A84C' : '#666' }}>
            👍 ({helpful})
          </button>
          <button onClick={() => { if (voted !== 'down') setVoted('down'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: voted === 'down' ? '#999' : '#666' }}>
            👎 (0)
          </button>
          <span style={{ fontSize: '12px', color: '#aaa' }}>·</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#666', textDecoration: 'underline' }}>Report</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>{review.author}</span>
          <span style={{ fontSize: '11px', color: '#aaa' }}>·</span>
          <span style={{ fontSize: '12px', color: '#666' }}>{review.flag} {review.country}</span>
          {review.verified && (<><span style={{ fontSize: '11px', color: '#aaa' }}>·</span><span style={{ fontSize: '11px', color: '#2a9d5c', fontWeight: '600' }}>Verified Purchase</span></>)}
        </div>
      </div>
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

const REVIEWS_PER_PAGE = 5;

export function ReviewsSection({ productId, productTitle }) {
  const storageKey = `vestoraa_reviews_v2_${productId}`;
  const autoReviews = useMemo(() => generateReviews(productId), [productId]);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ name: '', rating: 5, title: '', body: '', recommend: true, fit: 3, size: 3, quality: 4, value: 4, imageMatch: 4 });

  useEffect(() => {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith('vestoraa_reviews_') && !k.startsWith('vestoraa_reviews_v2_'))
        .forEach(k => localStorage.removeItem(k));
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setCustomerReviews(stored);
    } catch {}
  }, [storageKey]);

  const allReviews = [...customerReviews, ...autoReviews];
  const totalReviews = allReviews.length;
  const avgRating = totalReviews > 0 ? allReviews.reduce((s, r) => s + r.rating, 0) / totalReviews : 5;
  const starCounts = [5,4,3,2,1].map(star => ({ star, count: allReviews.filter(r => r.rating === star).length }));
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);
  const pagedReviews = allReviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.title || !form.body) return;
    const newReview = { id: `customer-${Date.now()}`, author: form.name, country: 'Your location', flag: '🌍', rating: form.rating, date: 'just now', title: form.title, body: form.body, verified: false, recommend: form.recommend, helpful: 0, fit: form.fit, size: form.size, quality: form.quality, value: form.value, imageMatch: form.imageMatch };
    const updated = [newReview, ...customerReviews];
    setCustomerReviews(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
    setShowForm(false); setSubmitted(true); setCurrentPage(1);
    setForm({ name: '', rating: 5, title: '', body: '', recommend: true, fit: 3, size: 3, quality: 4, value: 4, imageMatch: 4 });
  };

  const scrollToReviews = () => window.scrollTo({ top: document.getElementById('reviews')?.offsetTop - 80, behavior: 'smooth' });

  return (
    <div id="reviews" style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '400', color: '#111', marginBottom: '24px' }}>Customer Reviews</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #eee' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '52px', fontWeight: '300', color: '#111', lineHeight: 1 }}>{avgRating.toFixed(1)}</div>
          <Stars rating={Math.round(avgRating)} large />
          <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{totalReviews} reviews</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          {starCounts.map(({ star, count }) => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#555', width: '8px' }}>{star}</span>
              <span style={{ fontSize: '12px', color: '#C9A84C' }}>★</span>
              <div style={{ flex: 1, backgroundColor: '#eee', borderRadius: '4px', height: '8px' }}>
                <div style={{ width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%`, backgroundColor: '#C9A84C', height: '8px', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '12px', color: '#888', width: '16px' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {!showForm && (
        <div style={{ marginBottom: '32px' }}>
          {submitted && <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: '#f0faf4', border: '1px solid #b7dfca', borderRadius: '6px', fontSize: '13px', color: '#2a9d5c' }}>Thank you! Your review has been submitted.</div>}
          <button onClick={() => setShowForm(true)} style={{ border: '1.5px solid #111', padding: '12px 24px', fontSize: '13px', fontWeight: '700', color: '#111', backgroundColor: '#fff', cursor: 'pointer', letterSpacing: '0.05em', borderRadius: '4px' }}>Write a Review</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111', marginBottom: '20px' }}>Write Your Review</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px' }}>Your Name</label>
              <input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} placeholder="Jane D." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '8px' }}>Rating</label>
              <Stars rating={form.rating} interactive onRate={(r) => setForm(p => ({...p, rating: r}))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px' }}>Review Title</label>
              <input required value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} placeholder="Sum up your experience" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px' }}>Your Review</label>
              <textarea required value={form.body} onChange={e => setForm(p => ({...p, body: e.target.value}))} rows={4} style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} placeholder="Tell others what you think..." />
            </div>
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

      <div>
        {pagedReviews.map(review => <ReviewCard key={review.id} review={review} />)}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
          <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToReviews(); }} disabled={currentPage === 1}
            style={{ padding: '8px 14px', border: '1px solid #ddd', background: '#fff', color: currentPage === 1 ? '#ccc' : '#111', cursor: currentPage === 1 ? 'default' : 'pointer', fontSize: '12px', borderRadius: '3px' }}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => { setCurrentPage(p); scrollToReviews(); }}
              style={{ width: '32px', height: '32px', border: p === currentPage ? '1px solid #111' : '1px solid #ddd', background: p === currentPage ? '#111' : '#fff', color: p === currentPage ? '#fff' : '#111', cursor: 'pointer', fontSize: '12px', borderRadius: '3px', fontWeight: p === currentPage ? '700' : '400' }}>{p}</button>
          ))}
          <button onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollToReviews(); }} disabled={currentPage === totalPages}
            style={{ padding: '8px 14px', border: '1px solid #ddd', background: '#fff', color: currentPage === totalPages ? '#ccc' : '#111', cursor: currentPage === totalPages ? 'default' : 'pointer', fontSize: '12px', borderRadius: '3px' }}>Next →</button>
          <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>Page {currentPage} of {totalPages} · {totalReviews} reviews</span>
        </div>
      )}
    </div>
  );
}
