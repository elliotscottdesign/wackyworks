// Per-presentation defaults + helpers. One entry per client proposal.
// Add a new client by appending an entry to PRESENTATIONS, dropping
// photos into public/present/<slug>/, and sharing wackyworks.co.uk/
// present/<slug> with the access code.

const borough = (f) => `/present/live-nation/${f}`
// Left-column crops of the catalogue pages — copy + 3D isometric
// render only, with the themed install photos trimmed off.
const hole = (n) => `/present/holes/hole-page-${String(n).padStart(2, '0')}.jpg`

export const PRESENTATIONS = {
  'live-nation': {
    client: 'Live Nation',
    code: '3456',
    title: 'Adventure Golf — Live Nation',
    tagline: 'A 9-hole immersive crazy golf course by Wacky Works.',
    heroImage: borough('MPL_294A9363_Web.jpg'),

    intro: {
      eyebrow: 'Private presentation',
      headline: 'An adventure golf course for Live Nation',
      body: `Wacky Works designs and builds immersive crazy golf courses — modular, shippable and hand-finished.

This pack walks through what a 9-hole course for your venue could look like: a previous build we delivered under Plonk Golf at Borough, the nine obstacles earmarked for your course, how it ships and installs, and the costs.

Every figure, image and paragraph in this pack can be tailored to your brief.`,
    },

    photos: {
      intro:
        'A previous 9-hole course we designed and built at Borough — the same team, same build quality, same attention to every painted detail. Click any image to view full-size.',
      // 12 Borough photos copied in from the archive. Shown in a
      // responsive gallery; founder can add / reorder / swap via
      // inline edit mode.
      images: [
        borough('MPL_294A9363_Web.jpg'),
        borough('294A8741_web.jpg'),
        borough('MPL_294A9328_Web.jpg'),
        borough('294A8734_web.jpg'),
        borough('294A7912_web.jpg'),
        borough('MPL_294A9392_Web.jpg'),
        borough('294A8725_web.jpg'),
        borough('294A8728_web.jpg'),
        borough('294A7745_web_3.jpg'),
        borough('294A7835_web_2.jpg'),
        borough('294A7878_web.jpg'),
        borough('MPL_294A9417_Web.jpg'),
      ],
    },

    holes: {
      intro:
        'Nine interactive holes tailored for your space. Each piece is a proven design from our catalogue — the 3D renders below show the basic form of each hole. Final theming and finishes are confirmed at design stage.',
      items: [
        { n: 1, name: 'Mini loop + mini hill', image: hole(16) },
        { n: 2, name: 'Jump & catcher',        image: hole(11) },
        { n: 3, name: '½ pipe',                image: hole(8)  },
        { n: 4, name: 'Big ramp + ball runs',  image: hole(9)  },
        { n: 5, name: 'Shooter deck game',     image: hole(17) },
        { n: 6, name: 'Big loop + ramp',       image: hole(16) },
        { n: 7, name: 'Long beam',             image: hole(19) },
        { n: 8, name: '¼ pipe',                image: hole(14) },
        { n: 9, name: 'Skeeball',              image: hole(15) },
      ],
    },

    scale: {
      eyebrow: 'The build',
      headline: 'Shipped flat-pack · installed on-site',
      body: `Each hole averages 6m² — a 9-hole course fits comfortably into 80–150m² depending on circulation and theming.

The entire course ships on a small number of pallets. Local labour handles install under supervision from a Wacky Works project manager — no messy on-site fabrication, no production interruption to your venue.

Lead time is typically 10–14 weeks from deposit to delivery.`,
      planImage: '/catalog/pages/page-04.jpg', // the NEW LAYOUT page from the catalogue
    },

    costs: {
      eyebrow: 'Investment',
      headline: 'Three ways to deliver this course',
      body: `All prices exclude VAT. Every line can be cherry-picked — take the whole pack or just the pieces you need.`,
      packages: [
        {
          name: 'Natural Package',
          total: '£70k',
          blurb: 'Tried-and-tested obstacles in our standard finish — a blank canvas you can brand later.',
        },
        {
          name: 'ColourWorx Package',
          total: '£93k',
          blurb: 'Hand-painted hole by hole + one sculpted centrepiece. Eye-catching and camera-happy.',
        },
        {
          name: 'Fully Themed Package',
          total: '£120k',
          blurb: 'A full world: 9 painted finishes, 7 varying-sized hand-sculpted centrepieces, delivered and installed.',
        },
      ],
      footnote:
        'Equipment pack (100 clubs, 1000 balls, 10,000 scorecards, 1000 pencils, info signs) is £5k on top where not already included.',
    },
  },
}

export function getPresentation(slug) {
  return PRESENTATIONS[slug] || null
}
