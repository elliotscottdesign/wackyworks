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
        {
          n: 1,
          catalogueTitle: 'Loop da Loop',
          name: 'Mini loop + mini hill',
          image: hole(16),
          copy: 'A compact combo opener: a scaled-down loop paired with a mini hill. Perhaps the most beloved of all our obstacles — gravity-defying but unforgiving if you swing too hard.',
        },
        {
          n: 2,
          catalogueTitle: 'Jump & Target',
          name: 'Jump & catcher',
          image: hole(11),
          copy: 'Power and accuracy both matter. Players launch the ball off a ramp and aim to land it in a catcher — the ball then rolls out to the hole. Miss the catcher and it’s a putt on the greens to finish.',
        },
        {
          n: 3,
          catalogueTitle: '½ Pipe',
          name: '½ pipe',
          image: hole(8),
          copy: 'Players have to swoop the ball across two opposing ramps. Playing the angles is critical — misjudge it and the ball rests in a trap space, back at the start.',
        },
        {
          n: 4,
          catalogueTitle: 'Balancing Beam',
          name: 'Long beam',
          image: hole(9),
          copy: 'A 3-metre balancing beam. Players hit up the beam and over small bumpers to the hole. Side bumpers and thick grass make the fairway harder to recover from if the ball drops off the beam.',
        },
        {
          n: 5,
          catalogueTitle: 'Shooter Games',
          name: 'Shooter deck game',
          image: hole(17),
          copy: 'Hit the ball up a ramp to load the game, then use the club like a pool cue on the deck targets to score bonuses and continue. A unique gameplay piece that can be themed to match.',
        },
        {
          n: 6,
          catalogueTitle: 'Loop da Loop',
          name: 'Big loop + ramp',
          image: hole(16),
          copy: 'The signature obstacle, sized up: a big loop paired with a lead-in ramp. Watch your speed as well as your angle — too much power and the ball flies right out the other side.',
        },
        {
          n: 7,
          catalogueTitle: 'Big Ramp & Ball Runs',
          name: 'Big ramp + ball runs',
          image: hole(18),
          copy: 'Hit the ball to the top of a big ramp — it then gutters down a randomising ball run. Depending where the ball comes out the player may get a hole in 1, or have to putt to finish. Layout variations fit the space.',
        },
        {
          n: 8,
          catalogueTitle: 'Long Ramps',
          name: '¼ pipe',
          image: hole(14),
          copy: 'A tough shot requiring perfect power and line. A slow gradual slope raises to target holes at the end; land in the side pockets to score bonus points.',
        },
        {
          n: 9,
          catalogueTitle: 'Skeeball',
          name: 'Skeeball',
          image: hole(15),
          copy: 'Based on the classic arcade game. Players take a shot up a ramp and aim for specific targets to score bonus points. Used as the last hole — it catches and stores the balls — and can double as a promotional / marketing piece.',
        },
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
      body: `All prices exclude VAT. Three options, from a straight container hand-off through to full workshop redux, storage and install.`,
      packages: [
        {
          name: 'Delivered As-Is',
          total: '£15k',
          blurb:
            'A container of the existing course delivered to Live Nation. You handle installation and touch-up paint where needed. Fastest route and lowest cost.',
          lines: [
            { item: 'Course + container delivery', amount: '£15k' },
          ],
        },
        {
          name: 'Workshop Redux',
          total: '£25k',
          blurb:
            'Plonk takes the course into our workshop, repaints and cleans it down, then delivers it in January ready for Live Nation to store and install. Not restored to mint — it stays a second-hand course — but visibly refreshed.',
          lines: [
            { item: 'Course', amount: '£15k' },
            { item: 'Redux (repaint + clean)', amount: '£10k' },
          ],
        },
        {
          name: 'Full Redux · Stored · Installed',
          total: '£42k',
          blurb:
            'Full workshop redux, stored by Plonk through to summer, then installed and delivered to a London venue of your choice — ready for events.',
          lines: [
            { item: 'Course (upfront)', amount: '£15k' },
            { item: 'Continued storage', amount: '£7k' },
            { item: 'Redux', amount: '£10k' },
            { item: 'Install + delivery (London)', amount: '£10k' },
          ],
        },
      ],
      footnote:
        'Second-hand 9-hole course. Prices are the course only — equipment (clubs, balls, scorecards, pencils, signs) can be quoted on request.',
    },
  },
}

export function getPresentation(slug) {
  return PRESENTATIONS[slug] || null
}
