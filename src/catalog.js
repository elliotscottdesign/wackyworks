// Wacky Works catalogue — single source of truth.
// Images live in public/catalog/pages/ named page-01.jpg … page-30.jpg
// (matching the source PDF page order). To swap a page, replace the file.

const P = (n) => `/catalog/pages/page-${String(n).padStart(2, '0')}.jpg`

export const CONTACT = {
  email: 'elliot@wackyworks.co.uk',
  displayEmail: 'elliot@wackyworks.co.uk',
  address: 'London Fields · Hackney · E8',
  company: 'Wacky Works Ltd',
}

export const INTRO = {
  eyebrow: 'The Art of Play',
  stat: '1,000,000+',
  statLabel: 'players welcomed to our courses',
  body: `Elliot Scott founded and led Plonk Golf for 12 years, after a decade set-designing for film and advertising. Wacky Works channels that combined craft into unique, robust, low-maintenance crazy golf courses — designed to challenge every ability while reimagining what the game can be.

Our obstacles are born from over 500,000 crazy golfers playing across our venues. We know what makes a course fun, engaging and profitable. Everything ships flat-pack via pallet and installs with local labour — no messy on-site work slowing your venue down.`,
  cover: P(1),
  layout: P(4),
}

// The 14 modular obstacles that make up a course.
export const OBSTACLES = [
  { name: 'Big Hill', size: 'Variable', img: P(6), blurb: 'The essential first hole. Modular hill sections, with optional target slots at the top for added gameplay.' },
  { name: 'The Maze', size: '800 × 800 mm', img: P(7), blurb: 'Tilt the maze board to steer the ball past trap holes to the exit. Miss and the ball gutters back to try again.' },
  { name: '½ Pipe', size: 'Compact', img: P(8), blurb: 'Sweep between opposing ramps. Judge the angles wrong and the ball rests in a trap — right back at the start.' },
  { name: 'High Ramp', size: 'Compact', img: P(9), blurb: 'Launch the ball to the top of a tall ramp. A randomising ball run below decides whether it’s a hole-in-one or a putt to finish.' },
  { name: 'Big Ramp', size: 'Standard', img: P(10), blurb: 'A deceptively simple opener — players learn to use the bumpers to feed the ball into the central trough.' },
  { name: 'Jump & Target', size: '3000 × 3000 mm', img: P(11), blurb: 'Power and accuracy in one shot. Launch off the ramp, aim for the catcher; miss and it’s a putt on the greens.' },
  { name: 'Slotter Blockers', size: 'Add-on', img: P(12), blurb: 'Interchangeable target boards positioned anywhere on the fairway. Pull them out for bonuses or easier play.' },
  { name: 'Octopus Ramp', size: 'Standard', img: P(13), blurb: 'Roll perfectly to the top and the ball funnels through to the finish. Too hard and it loops back to try again.' },
  { name: 'Low Ramp', size: 'Standard', img: P(14), blurb: 'Gentle slope up to target holes. Side pockets score bonus points — perfect line and power required.' },
  { name: 'Arcade Hole', size: 'Standard', img: P(15), blurb: 'Classic arcade targets for score bonuses. Usually the final hole — catches the balls and can be co-branded.' },
  { name: 'The Loop', size: '1200 / 1500 / 1800 mm', img: P(16), blurb: 'The signature obstacle. Gravity-defying — but swing too hard and the ball flies straight out the other side.' },
  { name: 'Shooter Games', size: 'Add-on', img: P(17), blurb: 'Hit the ball up to load the game, then use the club like a pool cue on the deck targets for bonus points.' },
  { name: 'The Slider', size: '3000 × 3000 mm', img: P(19), blurb: 'Rope-and-pulley beam. Lift the ball carefully as it climbs the track — one slip and you start again.' },
  { name: 'Wall Ball', size: 'Compact', img: P(20), blurb: 'Balance the ball on the clubhead and race the track. A 2-player dexterity challenge with a bonus for the winner.' },
]

// The three finishing tiers.
export const FINISHES = [
  {
    name: 'Natural Finish',
    img: P(22),
    tagline: 'Blank canvas. Most affordable. Easy to reconfigure.',
    price: 'Starting package',
    includes: [
      '1 colour of astro turf + 1 stain or varnish',
      'High-quality putting grass',
      'All-weather paint and toughened varnish',
      'Easy to interchange holes and align with brands',
    ],
  },
  {
    name: 'ColourWorx',
    img: P(23),
    tagline: 'Eye-catching, camera-happy, memorable.',
    price: '~£2k per hole for painted finish',
    includes: [
      'Full design and painted finish per hole',
      'UV, graff, scenic or brand-aligned styles',
      'Optional coloured / inlaid carpets',
      'Perfect for UV courses and artist collaborations',
    ],
  },
  {
    name: 'Fully Themed',
    img: P(24),
    tagline: 'Playable sculpture. A world you play through.',
    price: 'From £4–5k per sculpt',
    includes: [
      'Hand-sculpted centrepieces in foam, timber or metal',
      'Fire-retardant foam, UV-resistant resin, weatherproof paint',
      'Full theme design, fabrication, paint and varnish',
      'Instagram-shareable moments = free marketing',
    ],
  },
]

// Services beyond the obstacles themselves.
export const SERVICES = [
  {
    name: 'Branding & Bespoke Hole Design',
    img: P(25),
    detail: 'Full art direction, scorecards, pencils, equipment, trophies, custom hole designs — from £3k per bespoke hole.',
  },
  {
    name: 'Course & Venue Design',
    img: P(26),
    detail: 'World creation, lighting, fitted holes, elevated gameplay, bespoke games. Project-based pricing.',
  },
  {
    name: 'Bar Design',
    img: P(27),
    detail: 'Immersive spaces, gardenscapes, railway arches, old pubs. Complete venue-and-bar design in-house.',
  },
]

// Turn-key package prices for a 9-hole course.
export const PACKAGES = [
  {
    name: 'Natural Package',
    total: '£70k',
    lines: [
      { item: '9 holes · 6m² avg', amount: '£63k' },
      { item: 'Equipment pack (optional)', amount: '£5k' },
      { item: 'Delivery (approx)', amount: '£2k' },
    ],
    tone: 'default',
  },
  {
    name: 'ColourWorx Package',
    total: '£93k',
    lines: [
      { item: '9 holes · 6m² avg', amount: '£63k' },
      { item: '9 detailed painted finishes', amount: '£18k' },
      { item: '1 sculpted “insta-moment”', amount: '£5k' },
      { item: 'Equipment pack (optional)', amount: '£5k' },
      { item: 'Delivery (approx)', amount: '£2k' },
    ],
    tone: 'accent',
  },
  {
    name: 'Fully Themed Package',
    total: '£120k',
    lines: [
      { item: '9 holes · 6m² avg', amount: '£63k' },
      { item: '9 detailed painted finishes', amount: '£18k' },
      { item: '7 varying-sized sculpts', amount: '£30k' },
      { item: 'Equipment pack', amount: '£5k' },
      { item: 'Delivery (approx)', amount: '£4k' },
    ],
    tone: 'premium',
  },
]

export const PACKAGE_NOTES = [
  'All prices exclude VAT.',
  'Install handled by client’s local team — Plonk can quote for install.',
  'Every line item can be cherry-picked à la carte.',
]

// The pricing reference sheet from the deck.
export const PRICING_SHEET = P(28)
