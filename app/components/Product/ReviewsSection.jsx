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
  { name: 'Sophie T.',    country: 'Australia',      flag: '🇦🇺' },
  { name: 'Emma R.',      country: 'United Kingdom',  flag: '🇬🇧' },
  { name: 'Isabella M.',  country: 'United States',   flag: '🇺🇸' },
  { name: 'Charlotte B.', country: 'Canada',          flag: '🇨🇦' },
  { name: 'Olivia S.',    country: 'New Zealand',     flag: '🇳🇿' },
  { name: 'Amelia K.',    country: 'Germany',         flag: '🇩🇪' },
  { name: 'Mia W.',       country: 'France',          flag: '🇫🇷' },
  { name: 'Chloe P.',     country: 'Singapore',       flag: '🇸🇬' },
  { name: 'Zoe L.',       country: 'Netherlands',     flag: '🇳🇱' },
  { name: 'Hannah J.',    country: 'Ireland',         flag: '🇮🇪' },
  { name: 'Lily C.',      country: 'Australia',       flag: '🇦🇺' },
  { name: 'Grace H.',     country: 'United Kingdom',  flag: '🇬🇧' },
  { name: 'Aria N.',      country: 'Sweden',          flag: '🇸🇪' },
  { name: 'Luna F.',      country: 'Spain',           flag: '🇪🇸' },
  { name: 'Stella D.',    country: 'Italy',           flag: '🇮🇹' },
  { name: 'Nora V.',      country: 'Belgium',         flag: '🇧🇪' },
  { name: 'Ruby A.',      country: 'Australia',       flag: '🇦🇺' },
  { name: 'Isla G.',      country: 'Scotland',        flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'Freya O.',     country: 'Denmark',         flag: '🇩🇰' },
  { name: 'Piper M.',     country: 'United States',   flag: '🇺🇸' },
  { name: 'Hazel B.',     country: 'Canada',          flag: '🇨🇦' },
  { name: 'Violet C.',    country: 'New Zealand',     flag: '🇳🇿' },
  { name: 'Aurora L.',    country: 'Norway',          flag: '🇳🇴' },
  { name: 'Scarlett R.',  country: 'Australia',       flag: '🇦🇺' },
  { name: 'Penelope W.',  country: 'United Kingdom',  flag: '🇬🇧' },
  { name: 'Elena S.',     country: 'Portugal',        flag: '🇵🇹' },
  { name: 'Maya T.',      country: 'United States',   flag: '🇺🇸' },
  { name: 'Layla K.',     country: 'UAE',             flag: '🇦🇪' },
  { name: 'Jasmine F.',   country: 'Malaysia',        flag: '🇲🇾' },
  { name: 'Camille D.',   country: 'France',          flag: '🇫🇷' },
];

function detectCategory(title, productType) {
  const text = ((title || '') + ' ' + (productType || '')).toLowerCase();
  if (/\b(bag|bags|tote|handbag|clutch|purse|satchel|crossbody|backpack|pouch)\b/.test(text)) return 'bag';
  if (/\b(shoe|shoes|heel|heels|sneaker|sneakers|boot|boots|sandal|sandals|flat|flats|loafer|loafers|pump|pumps|mule|mules)\b/.test(text)) return 'shoes';
  if (/\b(dress|dresses|gown|maxi|mini dress|midi dress|wrap dress)\b/.test(text)) return 'dress';
  if (/\b(skirt|skirts|mini skirt|midi skirt|maxi skirt|pleated skirt)\b/.test(text)) return 'skirt';
  if (/\b(pant|pants|trouser|trousers|wide.leg|jogger|joggers|legging|leggings|culotte|culottes)\b/.test(text)) return 'pants';
  if (/\b(top|tops|blouse|blouses|shirt|shirts|tee|tees|tank|tanks|cami|camisole|bodysuit|crop top)\b/.test(text)) return 'top';
  if (/\b(jacket|jackets|coat|coats|blazer|blazers|cardigan|cardigans|knit|knitwear|sweater|jumper)\b/.test(text)) return 'outerwear';
  if (/\b(jumpsuit|jumpsuits|romper|rompers|playsuit|playsuits|matching set|two.piece)\b/.test(text)) return 'jumpsuit';
  if (/\b(jewel|jewellery|jewelry|necklace|ring|bracelet|earring|earrings|bangle|pendant|chain)\b/.test(text)) return 'jewellery';
  if (/\b(belt|belts|scarf|scarves|hat|hats|cap|caps|headband|sunglasses|accessory|accessories)\b/.test(text)) return 'accessory';
  return 'general';
}

const CATEGORY_TEMPLATES = {
  bag: [
    { title: 'The perfect everyday bag',            body: 'I was looking for something that fits my essentials without being bulky and this is exactly it. My phone, wallet, keys and more all fit perfectly with room to spare. The straps are comfortable even after a full day of carrying it.' },
    { title: 'Holds more than it looks',            body: 'Genuinely surprised by how much fits inside. I packed it for a day out with my laptop, water bottle and all my usual bits and it handled everything. The structure means it keeps its shape even when full.' },
    { title: 'Gets so many compliments',            body: 'I have had strangers stop me to ask where this bag is from. The hardware detail is really beautiful in person and the colour is rich and deep. It photographs well but looks even better on your arm.' },
    { title: 'The strap length is perfect',         body: 'I can wear this crossbody or on my shoulder and both options feel right. The strap does not dig in and the bag sits at a really flattering height. A small detail but it makes such a difference for all-day wear.' },
    { title: 'Quality zips, no snagging',           body: 'The zipper glides perfectly — no catching, no stiffness. I have had expensive bags where the zip was the first thing to go and this feels far more solid. The lining inside is also really clean and easy to wipe down.' },
    { title: 'Great size for work and weekends',    body: 'Monday to Friday it holds my work essentials, weekends it becomes my going-out bag. That kind of versatility is exactly what I look for. No need to swap everything between bags each day.' },
    { title: 'Does not scratch easily',             body: 'I have been carrying this daily for two months and it still looks pristine. No scratches, no peeling, no discolouration. Really pleased with how well it is wearing over time.' },
    { title: 'Organised interior, love it',         body: 'The pockets inside are genuinely useful — card slots, a zipped pocket and a phone slot. I always know exactly where everything is, which saves so much time instead of rummaging at the bottom.' },
    { title: 'Lightweight despite its size',        body: 'I was worried it would be heavy but it is really lightweight even loaded up. My shoulders are not aching at the end of the day which says a lot about how well it is constructed.' },
    { title: 'Colour is true to the photos',        body: 'I ordered online nervous the colour might look different in person. It is exactly as it looks on screen — no surprises. Really happy with the accuracy of the product photography.' },
    { title: 'Structured and holds its shape',      body: 'Unlike softer bags that slump when you put them down, this one stands up on its own. The base is firm and the sides keep their form. Makes it so much easier to find things inside.' },
    { title: 'Hardware is solid, not plasticky',    body: 'The clasp and rings feel weighty and real. Nothing rattles or flexes in a way that feels cheap. You can tell the quality in every touchpoint — the kind of thing that ages well.' },
    { title: 'Perfect for travelling light',        body: 'Took this on a weekend trip as my only bag and it held everything I needed. Fits under the seat on the plane with room left over. It has become my go-to travel companion.' },
    { title: 'Converts from tote to crossbody',     body: 'The detachable strap is a really useful feature. I use the tote handles for smart occasions and clip on the strap when I need my hands free. Two bags in one, essentially.' },
    { title: 'Real quality leather, smells lovely', body: 'When I opened the box the leather smell was immediate and genuine — not artificial. The surface is smooth and supple and it has softened even more with use. A bag I will have for years.' },
  ],
  shoes: [
    { title: 'Comfortable from the very first wear',        body: 'I never expect new shoes to feel broken in immediately but these did. No blisters, no rubbing, no pinching — just comfort. I wore them for a full evening out and my feet felt fine at the end of the night.' },
    { title: 'The heel height is totally manageable',       body: 'I am not someone who wears high heels regularly but these feel stable and secure. The block heel gives me enough height to feel dressed up without wobbling. Perfect for someone who wants the look without the pain.' },
    { title: 'True to size — order your usual',             body: 'I debated going up a half size as I sometimes do with heels but my regular size fit perfectly. The toe box has a little room without being loose at the heel. Reassuring when buying shoes online.' },
    { title: 'Did not slip in the rain at all',             body: 'I wore these on a wet day and the sole gripped well on both pavement and tiles. I was nervous about slipping but had no issues at all. That grip quality matters more than people admit when choosing shoes.' },
    { title: 'Elegant without looking overdone',            body: 'There is a refinement to these shoes that works with both casual and formal outfits. Not too much embellishment, not too plain. They lift any outfit without demanding attention.' },
    { title: 'Ankle strap holds securely all day',          body: 'The strap does not loosen throughout the day which is something I always worry about with ankle strap designs. My foot stays securely in place even after hours of walking.' },
    { title: 'Stood for six hours, feet were fine',         body: 'The insole has a real layer of cushioning which makes standing for long periods so much more bearable. I wore these at a wedding and was on my feet for six hours — something I could not have done in most heels.' },
    { title: 'Goes with everything in my wardrobe',         body: 'I chose the neutral colour and it works with dresses, trousers, jeans and skirts. A genuinely versatile shoe that earns its place in my rotation by going with almost everything.' },
    { title: 'No breaking-in period needed at all',         body: 'I have had shoes that took weeks of suffering before they became comfortable. Not these — they felt right from day one. The leather is supple and the lining is soft against the foot.' },
    { title: 'Looks expensive, holds its own',              body: 'The finish on these shoes is really impressive. The stitching is neat, the sole is solid and the overall look is polished. They sit alongside far more expensive pairs I own and hold their own completely.' },
    { title: 'Great for standing on my feet all day',       body: 'I work in a role where I am on my feet most of the day and finding comfortable shoes that also look professional is hard. These manage both. My feet are not aching by 3pm which is honestly rare.' },
    { title: 'Toe shape is flattering, not painful',        body: 'The cut at the toe is flattering without squeezing. It gives a sleek, elongating line without the pinching that pointed toe shoes can cause by the end of the day.' },
    { title: 'Easy to walk in, even on cobblestones',       body: 'I tested these on a city walk with uneven surfaces and they performed well. The heel did not catch and the sole was stable throughout. For anyone who lives in an older city, that matters.' },
    { title: 'Colour matched the photos exactly',           body: 'I ordered the nude colour online which can go very wrong depending on undertones. The colour on arrival matched my skin tone well and looked exactly as it did in the product images. Really pleased.' },
    { title: 'My new go-to for dinners and events',         body: 'I wore these to a dinner and got three separate compliments on them through the evening. They look really beautiful with a midi dress and the heel height photographs perfectly. A great occasion shoe.' },
  ],
  dress: [
    { title: 'Wore it to a wedding — got stopped all night', body: 'Multiple people asked where this dress was from throughout the evening. The way it moves when you walk is really beautiful and the fabric photographs incredibly well. A dress that earns every compliment.' },
    { title: 'The midi length is so flattering',            body: 'The midi length hits at exactly the right point on my leg. It grazes the calf in a way that is genuinely elongating without being impractical. I have been looking for a midi this flattering for ages.' },
    { title: 'No shapewear needed — the cut does it all',   body: 'The cut is forgiving in the right places and structured where it needs to be. I wore this without shapewear for the first time in years and felt completely confident. The design does the work for you.' },
    { title: 'Drove 40 mins and arrived crease-free',       body: 'I drove to an event in this dress and arrived completely crease-free. The fabric is brilliant — it moves and breathes without picking up creases. Perfect for travelling to an occasion.' },
    { title: 'Skims the body, does not cling or ride up',   body: 'The material skims over the body rather than clinging, and it stays put when I walk. On a hot day when everything else sticks, this one moves freely and stays exactly where it should.' },
    { title: 'Side zip is discreet and smooth',             body: 'The zip is well concealed and glides without any resistance. I can get in and out of it myself without any gymnastics which is something I always check with fitted dresses. A really well-thought-out detail.' },
    { title: 'Dressed it up and down the same day',         body: 'I wore this with sandals and a basket bag for a lunch and then with heels and gold jewellery for dinner. The same dress, completely different looks. That kind of versatility justifies the purchase immediately.' },
    { title: 'Neckline is elegant and stays put all night', body: 'The neckline sits exactly where it should — low enough to feel feminine but secure enough to lean forward without worry. I appreciated being able to wear it without constantly adjusting it all evening.' },
    { title: 'True to size, no guessing needed',            body: 'I ordered my usual size based on the measurements and it fits exactly as expected. The bodice sits flat, the waist is in the right place, and the length is exactly as photographed. Reliable sizing makes such a difference.' },
    { title: 'Colour is rich and saturated in person',      body: 'In the photos it looked beautiful. In person it is even more vibrant. The dye quality is really apparent — it has depth and saturation that you do not usually see at this price point.' },
    { title: 'Breathable fabric, wore it comfortably all day', body: 'I had a full day of activities in this dress and never felt uncomfortable or overheated. The fabric breathes well and did not feel heavy even as the day warmed up. That is rare in a dress this structured.' },
    { title: 'Back detail is just as pretty as the front',  body: 'The back of this dress is as beautiful as the front. There is a detail in the fabric or cut that makes turning around just as interesting as facing forward. I always love a dress that works from every angle.' },
    { title: 'Washed on cold, still perfect',               body: 'I carefully hand-washed this on cold and it came out looking exactly as it did on arrival. No shrinkage, no colour bleeding, no distortion. The care instructions are accurate and the fabric handles washing well.' },
    { title: 'Comfortable enough to dance in all night',    body: 'I wore this to a wedding reception and danced for hours without any pulling, slipping or discomfort. A dress that moves with you rather than against you is genuinely hard to find at any price.' },
    { title: 'A dress I will genuinely wear for years',     body: 'The style is not trend-dependent — it is classic enough to feel relevant in three years. The construction quality matches that longevity. This is the kind of dress you photograph and remember.' },
  ],
  skirt: [
    { title: 'The waistband sits perfectly all day',        body: 'I am always wary of waistbands that roll or dig in, but this one sits flat and stays put all day. No adjusting, no rolling, no discomfort. It just works every single time I wear it.' },
    { title: 'Pairs with literally everything I own',       body: 'I have worn this with four different tops already and it works with all of them. A neutral skirt that genuinely goes with the rest of your wardrobe is harder to find than it sounds.' },
    { title: 'Does not ride up when I walk',                body: 'I walk a lot and skirts that ride up with each stride are a constant frustration. This one stays exactly where it is meant to be. The weight of the fabric and the cut together prevent it entirely.' },
    { title: 'Length is perfect for the office',            body: 'I was looking for something smart enough for work and this delivers. The knee length is professional without feeling dated. I have worn it with blazers and cardigans and it works in every combination.' },
    { title: 'Pleats stay crisp even after washing',        body: 'After wearing and washing, the pleats have kept their shape. I expected them to soften out but they have maintained their crispness. The fabric quality is clearly a factor in how well they hold.' },
    { title: 'Flows beautifully when I walk',               body: 'There is something about how this skirt moves when you walk that feels really special. It swings in a way that is neither stiff nor floppy — just the right amount of movement for the length.' },
    { title: 'Lining length is exactly right',              body: 'The lining is the right length and does not peek below the hem, which is such a common problem with lined skirts. It also prevents the outer fabric from clinging to tights in winter. Thoughtfully done.' },
    { title: 'Works with heels and flats equally well',     body: 'I wore this with heels to a dinner and again with ballet flats for errands. Both looked intentional and put-together. A skirt that only works one way is limiting — this one adapts well.' },
    { title: 'High waist is genuinely flattering',          body: 'The high waist sits at the natural waist rather than above it, which I prefer. It gives definition without looking costumey. The positioning makes the most of any shape.' },
    { title: 'Real pockets — actually useful ones',         body: 'Real pockets that fit a hand and a phone. I know the bar is low but we appreciate it enormously. The pockets are properly sewn in and do not bulge or distort the silhouette when in use.' },
  ],
  pants: [
    { title: 'Finally, trousers that fit my proportions',   body: 'The rise, the leg width and the length are all exactly right for me. I have a longer torso and shorter legs and often struggle — these fit without needing any alteration. A genuinely rare find.' },
    { title: 'The wide leg is elegant, not overwhelming',   body: 'Wide leg trousers can look overwhelming on a shorter frame but the cut of these manages to be flattering. The fabric falls cleanly and gives a really elongating line from waist to floor.' },
    { title: 'Comfortable to sit in for a full day',        body: 'I wore these for a full day of desk work and meetings and never once felt restricted or uncomfortable. The waistband does not pinch when seated and the fabric does not pull across the thighs.' },
    { title: 'Crease-resistant — great for travel',         body: 'I wore these on a long flight and they arrived looking almost as pressed as when I put them on. For anyone who travels for work, that is genuinely important. A fabric that handles being sat in well.' },
    { title: 'Hem length is perfect for a modest heel',     body: 'The length is exactly right to graze the floor with a modest heel. If you are petite you may want to hem them but the length photographed is the length you get — no extra fabric pooling.' },
    { title: 'Smart enough for the boardroom',              body: 'I wore these to a client presentation and felt completely professional. The cut is clean, the fabric is polished and they sat flat with a tucked-in blouse. Exactly the look I was going for.' },
    { title: 'Waistband stays in place all day',            body: 'No rolling down throughout the day, no readjusting after sitting. The waistband is properly constructed and sits where it should from morning to evening. A simple thing that matters enormously.' },
    { title: 'Forgiving fabric — skims beautifully',        body: 'The fabric weight and drape are really forgiving. Unlike thinner fabrics that show everything, this one skims and moves. I felt genuinely comfortable and confident wearing these all day.' },
    { title: 'Breathable but does not crease like linen',   body: 'It has the light, breathable quality of linen without picking up every crease the moment you sit down. The weave preserves the comfort while losing the limitation. A really clever fabric choice.' },
    { title: 'Changed at work — looked completely fresh',   body: 'I packed these in my bag and changed at the office — arrived looking completely clean and pressed. The fabric recovers quickly from being folded which makes it a really practical choice for commuters.' },
  ],
  top: [
    { title: 'Tucks in and stays there all day',            body: 'I am particular about how tops behave when tucked in — whether they bunch, whether the hem is smooth, whether they stay put. This one tucks perfectly and stays there. A small detail that makes a big difference.' },
    { title: 'Sleeve length hits the perfect spot',         body: 'Not too long to roll up, not too short to leave the wrist exposed in autumn. The sleeve hits at the exact right point on my arm and gives the proportions I was hoping for.' },
    { title: 'Does not go see-through in direct sunlight',  body: 'I wore this on a bright day and was able to move through direct sunlight without any transparency issues. The fabric has enough weight to it that it remains opaque in all conditions.' },
    { title: 'Stays tucked in from morning to evening',     body: 'I spent the day alternating between sitting and standing and this top stayed exactly where I put it. No constant adjusting, no shirt tail appearing — it just behaves all day.' },
    { title: 'Collar keeps its shape all day long',         body: 'The collar keeps its shape even after a full day of wear. It does not wilt or lose its structure by the afternoon. The interfacing is clearly good quality and the collar sits flat and clean.' },
    { title: 'Feminine without being fussy to style',       body: 'There is a delicacy to the design — a small ruffle, a subtle pleat, a refined neckline — that feels feminine without requiring any effort to style. I threw it on with jeans and felt completely put-together.' },
    { title: 'Fits perfectly under a blazer',               body: 'The fit is slim enough to sit under a blazer without bunching but not so fitted that it becomes uncomfortable. I have been reaching for it as my go-to office base layer all week.' },
    { title: 'Shoulder seam sits exactly right',            body: 'The shoulder seam lands exactly on the shoulder point which is often where tops go wrong for me. When a garment fits at the shoulder everything else falls into place, and this one does.' },
    { title: 'Machine wash, comes out perfect',             body: 'I machine-washed this on a cool gentle cycle and it came out looking exactly as it went in. No shrinkage, no fading, no distortion. Easy-care clothing is genuinely underrated.' },
    { title: 'Desk to dinner without changing',             body: 'I wore this in the office all day with tailored trousers and swapped to a skirt and heels for a dinner afterwards. The top held its own in both contexts without a single adjustment.' },
  ],
  outerwear: [
    { title: 'Blocks the wind completely',                  body: 'I wore this on a really blustery day and felt completely shielded. The fabric is tightly woven enough to block wind without feeling stiff or heavy. A coat that does its job properly without the bulk.' },
    { title: 'Fits over chunky knits with ease',            body: 'One of my frustrations with tailored coats is that they are cut too slim to wear over anything thick. This one has enough room through the body to layer comfortably without pulling at the buttons.' },
    { title: 'Shoulder fit is exactly right',               body: 'The shoulder fit is everything with a coat and this one sits perfectly. No padding that extends too far, no dropping that makes you look swamped. The structure is really clean and intentional.' },
    { title: 'Warm without any bulk at all',                body: 'I am surprised by how warm this is given how light it feels to carry. The lining is clearly doing a lot of work. It packs down better than most coats I own and provides real warmth throughout.' },
    { title: 'Buttons are weighty and solid',               body: 'The buttons are substantial and real-feeling. They do not catch the light in a cheap way and they sit flush when fastened. A good button on a coat is a marker of overall quality.' },
    { title: 'Length is flattering on every height',        body: 'The coat hits at a point that works with everything I own — long enough to cover most hemlines, short enough not to drag. The length was clearly considered carefully in the design.' },
    { title: 'No pilling after multiple washes',            body: 'I have washed this several times now and there is no pilling on the body or sleeves. The fabric quality is really evident in how it holds up to wear and cleaning over time.' },
    { title: 'A classic I will wear for years',             body: 'The cut is timeless rather than trend-led. I do not want to be replacing a coat every season and this is the kind of investment that pays off — something I will reach for every autumn for years.' },
    { title: 'Pockets are deep and actually useful',        body: 'The pockets are properly deep and sit at the right height on the body. I can fit my phone and a folded card case in each one. Functional coat pockets are not a given and these are excellent.' },
    { title: 'Lining makes it easy to pull on',            body: 'The lining is silky and the coat slides on over other clothes without dragging or creating static. A small thing but one that makes the morning routine genuinely easier every day.' },
  ],
  jumpsuit: [
    { title: 'Getting dressed has never been easier',       body: 'One piece and the outfit is done. No thinking about what goes with what, no second-guessing proportions. I just put this on and feel immediately pulled-together. The convenience is genuinely underrated.' },
    { title: 'Waist is defined — not shapeless at all',     body: 'I was worried a jumpsuit would make me look shapeless but the waist detail creates real definition. It emphasises the right place and gives a feminine silhouette that a lot of one-pieces miss completely.' },
    { title: 'Bathroom trips are actually manageable',      body: 'Yes, I am going to say it — the design makes bathroom trips actually manageable. Whoever designed this thought about wearability in a real, practical way. It matters more than people admit with jumpsuits.' },
    { title: 'Proportions work even for petite frames',     body: 'I am 5\'3 and jumpsuits often have too much fabric in the torso or legs. This one works well at my height — the proportions are spot on without needing significant alteration.' },
    { title: 'Office to dinner without changing',           body: 'I wore this to the office with loafers and a blazer, then straight out for dinner by removing the blazer and adding heels. No outfit change needed — the jumpsuit does the heavy lifting.' },
    { title: 'Neckline sits and stays perfectly',           body: 'The neckline framing makes a real difference to how the whole piece wears. This one sits beautifully — not so low as to require tape, not so high as to feel frumpy. Exactly right.' },
    { title: 'No creases after a full day at a desk',       body: 'I was in meetings and at a desk all day and this did not pick up a single crease in the seat or back. The fabric choice is clearly deliberate — it moves and recovers well even after hours of sitting.' },
    { title: 'Belt loops are reinforced and solid',         body: 'The loops are stitched properly and show no sign of weakening. I wear this with a thin belt often and the loops handle the weight without pulling or distorting the fabric around the waist.' },
  ],
  jewellery: [
    { title: 'Has not tarnished even with daily wear',      body: 'I wear this almost daily and it still looks as bright as the day it arrived. I was sceptical given the price point but the plating quality is clearly better than I expected. No green marks, no dulling at all.' },
    { title: 'Clasp is easy to do up by myself',            body: 'I can fasten this by myself in seconds, which is something I cannot say for most necklaces I own. The clasp is well engineered — it clicks closed securely and stays that way all day.' },
    { title: 'Sits flat and does not twist around',         body: 'The chain lays flat against the neckline without rotating or bunching. Necklaces that twist around are constantly frustrating to fix. This one stays where you put it, which I appreciate enormously.' },
    { title: 'Lightweight — forgot I was wearing it',       body: 'I forgot I was wearing this by midday which is the best compliment I can give a piece of jewellery. No pulling, no heaviness at the ears or neck. Just there when you want it to be.' },
    { title: 'Feels substantial, not hollow or flimsy',     body: 'There is a satisfying heaviness to this piece — not so heavy as to be uncomfortable, but enough to feel substantial and real. It does not feel hollow or flimsy the way some pieces at this price can.' },
    { title: 'Earrings do not drag on my lobes at all',     body: 'I have sensitive ears and heavy earrings become painful quickly. These are engineered well enough that the weight is distributed and my ears do not ache after a full day of wearing them.' },
    { title: 'Works with both gold and silver pieces',      body: 'The tone sits between warm and cool enough that it layers with both gold and silver jewellery I own. Mixed metals are having a moment and this piece plays nicely in both directions.' },
    { title: 'Someone asked if it was a designer piece',    body: 'I wore this to an event and someone asked if it was a designer piece. The design is refined and the finish is clean enough to hold its own alongside far more expensive things.' },
  ],
  accessory: [
    { title: 'Ties so many outfits together',               body: 'I had not appreciated how much a well-chosen accessory could change a look until I started wearing this regularly. It adds something to even the simplest outfit without any effort at all.' },
    { title: 'Adjustable and stays exactly in place',       body: 'The fit is adjustable and once I found my size it did not move throughout the day. Nothing worse than constantly repositioning something — this one stays exactly where you put it.' },
    { title: 'Works with neutrals and prints equally',      body: 'I chose this because I wanted something that would work across my wardrobe and it does. Neutrals, prints, patterned pieces — it coordinates without clashing in any combination.' },
    { title: 'The perfect finishing touch to any look',     body: 'This is the kind of accessory that makes a basic outfit feel complete. On its own the piece is nice; on an outfit it elevates the whole look. That is what good accessories do.' },
  ],
  general: [
    { title: 'Absolutely love this piece',                  body: 'From the moment I received it I knew this was going to be a favourite. The quality feels elevated and everything about it is exactly right.' },
    { title: 'Better than I expected',                      body: 'I was a little unsure ordering online but this exceeded every expectation. The quality is genuinely impressive for the price point.' },
    { title: 'Compliments every single time',               body: 'Every time I wear or use this someone asks where it is from. The design is really striking and the quality in person is even nicer than the photos.' },
    { title: 'Looks far more expensive than it is',         body: 'The construction is really solid and overall it looks like something from a designer shelf. Genuinely impressed with the quality relative to the cost.' },
    { title: 'Will be buying more styles',                  body: 'Already planning my next order. This is the kind of piece you want in every version once you experience the quality.' },
    { title: 'Packaged beautifully, arrived fast',          body: 'Came well packaged and arrived earlier than expected. The item itself is even lovelier in person — really pleased overall.' },
    { title: 'Exactly as described online',                 body: 'The product description was accurate and honest. What arrived matched perfectly — no disappointment, no surprises.' },
    { title: 'Second purchase, just as happy',              body: 'This is not my first order from Vestoraa and I am just as impressed this time. Consistent quality you can rely on.' },
    { title: 'Really glad I took the chance',               body: 'I was hesitant because I had not ordered from here before. Completely glad I did — quality is excellent and delivery was fast.' },
    { title: 'Nothing to fault at all',                     body: 'I genuinely cannot think of a single criticism. Everything from the packaging to the product itself was excellent.' },
    { title: 'A pleasure to use every time',                body: 'Some things you use out of necessity. This one you actually look forward to reaching for. That is a real quality indicator.' },
    { title: 'Would gift this to a friend',                 body: 'This is the kind of quality I would happily give as a gift. It looks and feels like something thoughtfully chosen.' },
    { title: 'Impressive quality for online shopping',      body: 'Online shopping can be a gamble with quality but this delivered. Really impressed with the overall standard of the product.' },
    { title: 'Colour is stunning in person',                body: 'The colour photographed well but in real life it is even richer and more beautiful. I have had so many compliments already.' },
    { title: 'My most-reached-for piece this month',        body: 'I have reached for this more than anything else I own this month. It just works every single time.' },
  ],
};

function generateReviews(productId, productTitle, productType) {
  const category = detectCategory(productTitle, productType);
  const templates = CATEGORY_TEMPLATES[category] || CATEGORY_TEMPLATES.general;
  const general = CATEGORY_TEMPLATES.general;
  const combined = [...templates, ...general].filter(
    (t, i, arr) => arr.findIndex(x => x.title === t.title) === i
  );
  const rng = seededRng(String(productId));
  const count = Math.min(12 + Math.floor(rng() * 12), combined.length);
  const authorPool = [...AUTHORS].sort(() => rng() - 0.5);
  const templatePool = [...combined].sort(() => rng() - 0.5).slice(0, count);
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

export function ReviewsSection({ productId, productTitle, productType }) {
  const storageKey = `vestoraa_reviews_v2_${productId}`;
  const autoReviews = useMemo(
    () => generateReviews(productId, productTitle, productType),
    [productId, productTitle, productType]
  );
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
