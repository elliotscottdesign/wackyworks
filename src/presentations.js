// Per-presentation defaults + helpers. One entry per client proposal.
// Add a new client by appending an entry to PRESENTATIONS, dropping
// photos into public/present/<slug>/, and sharing wackyworks.co.uk/
// present/<slug> with the access code.

const borough = (f) => `/present/live-nation/${f}`
// Left-column crops of the catalogue pages, copy + 3D isometric
// render only, with the themed install photos trimmed off.
const hole = (n) => `/present/holes/hole-page-${String(n).padStart(2, '0')}.jpg`

export const PRESENTATIONS = {
  'live-nation': {
    client: 'Live Nation',
    code: '3456',
    title: 'Adventure Golf, Live Nation',
    tagline: 'A 9-hole immersive crazy golf course by Wacky Works.',
    heroImage: borough('294A7835_web_2.jpg'),
    heroVideo: borough('london-course.mp4'),

    intro: {
      eyebrow: 'Private presentation',
      headline: 'An adventure golf course for Live Nation',
      body: `Wacky Works designs and builds immersive crazy golf courses, modular, shippable and hand-finished.

This course has been in operation at our Borough Market venue for over four years. It has entertained many Londoners and remains a great working, playable piece of art. The course was designed by Plonk and painted by one of London's top graffiti crews, including works by Tiser, Shuck 1, Nacho Welles and other members of the Ghostwriters. They will be employed again for the redux and any additional work added to the course, making this a truly unique London-themed experience.

This pack walks through the nine themed holes, how it ships and installs, and the costs.`,
    },

    photos: {
      intro:
        'Nine themed holes, as installed at Plonk Borough. Click any image to view full-size.',
      // 9 themed holes shown with their on-site photo + body copy.
      // The photo swap for Hole 4 is a new image; founder can
      // reorder / swap any image via the inline editor.
      holes: [
        {
          n: 1,
          name: 'Eel & Mushy Pea',
          image: borough('294A7835_web_2.jpg'),
          copy: 'Based on the traditional London food of eels and peas. Players putt around a 60cm-tall eel loop, pop over the pea hill and land near the hole.',
        },
        {
          n: 2,
          name: 'Thames jump · Tower of London',
          image: borough('hole-2-thames-tower.jpg'),
          copy: 'Players jump over the Thames and into the Tower of London. Lucky enough to ring the crown on the way through and they earn bonus shots.',
        },
        {
          n: 3,
          name: 'Borough Market',
          image: borough('294A7878_web.jpg'),
          copy: 'Players putt around Borough Market. A ½-pipe hole where players have to putt carefully up and down to reach the hole, or they will find themselves having to play a few more strokes.',
        },
        {
          n: 4,
          name: 'Tower Bridge',
          image: borough('hole-4-tower-bridge.webp'),
          copy: 'Players have to putt along and across Tower Bridge. Fall off along the way and they take a penalty. Themed with Tower Bridge sculptures and colour-coded astro.',
        },
        {
          n: 5,
          name: 'Love Guns · HMS Belfast',
          image: borough('294A8728_web.jpg'),
          copy: 'Players putt up a big ramp and load the cannons of the Belfast. Then pull back on a pinball-style launcher and try to hit bonuses to clear the mini-game and get back to the fairway to finish.',
        },
        {
          n: 6,
          name: 'London Eye',
          image: borough('294A8741_web.jpg'),
          copy: 'Players putt around a 1.2m-tall London Eye-themed loop. Hit it with enough power and the ball rolls around a Southbank skatepark-themed ramp down to the finishing hole.',
        },
        {
          n: 7,
          name: 'Red Phone Box',
          image: borough('MPL_294A9363_Web.jpg'),
          copy: 'Players hit the ball up a red phone box. The ball then rolls down a ball run and lands on a sloped, tricky fairway to putt out.',
        },
        {
          n: 8,
          name: 'Thames Barrier',
          image: borough('MPL_294A9392_Web.jpg'),
          copy: 'Players swoosh around a tidal wave taking over the Thames Barrier. Playing off the bumpers, they navigate the treacherous waters to reach the hole. Thick astro and bumpers can get in their way.',
        },
        {
          n: 9,
          name: 'Market Stall / Tube Train',
          image: borough('MPL_294A9417_Web.jpg'),
          copy: 'Players putt up into a market stall. The hole can be re-themed as a tube train with underground seating material cladding the inside. Land the ball into a catcher hole for a bonus; miss and the ball rolls back out to shoot again.',
        },
      ],
    },

    holes: {
      intro:
        'See below the plain 3D models of the holes. These are from our catalogue and give you a basic concept of how the holes will play.',
      items: [
        {
          n: 1,
          catalogueTitle: 'Loop da Loop',
          name: 'Mini loop + mini hill',
          image: hole(16),
          copy: 'A compact combo opener: a scaled-down loop paired with a mini hill. Perhaps the most beloved of all our obstacles, gravity-defying but unforgiving if you swing too hard.',
        },
        {
          n: 2,
          catalogueTitle: 'Jump & Target',
          name: 'Jump & catcher',
          image: hole(11),
          copy: 'Power and accuracy both matter. Players launch the ball off a ramp and aim to land it in a catcher, the ball then rolls out to the hole. Miss the catcher and it’s a putt on the greens to finish.',
        },
        {
          n: 3,
          catalogueTitle: '½ Pipe',
          name: '½ pipe',
          image: hole(8),
          copy: 'Players have to swoop the ball across two opposing ramps. Playing the angles is critical, misjudge it and the ball rests in a trap space, back at the start.',
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
          copy: 'The signature obstacle, sized up: a big loop paired with a lead-in ramp. Watch your speed as well as your angle, too much power and the ball flies right out the other side.',
        },
        {
          n: 7,
          catalogueTitle: 'Big Ramp & Ball Runs',
          name: 'Big ramp + ball runs',
          image: hole(18),
          copy: 'Hit the ball to the top of a big ramp, it then gutters down a randomising ball run. Depending where the ball comes out the player may get a hole in 1, or have to putt to finish. Layout variations fit the space.',
        },
        {
          n: 8,
          catalogueTitle: 'Big Ramps',
          name: 'Big ramps',
          image: hole(10),
          copy: 'A fun way to start, or close, a sequence. What looks like a simple shot gets tricky fast: players have to learn to use the bumpers to find the right angle into the central trough. Variations add bonus targets and ball traps.',
        },
        {
          n: 9,
          catalogueTitle: 'Skeeball',
          name: 'Skeeball',
          image: hole(15),
          copy: 'Based on the classic arcade game. Players take a shot up a ramp and aim for specific targets to score bonus points. Used as the last hole, it catches and stores the balls, and can double as a promotional / marketing piece.',
        },
      ],
    },

    scale: {
      eyebrow: 'The build',
      headline: 'Shipped flat-pack · installed on-site',
      body: `Each hole averages 6m², a 9-hole course fits comfortably into 80–150m² depending on circulation and theming.

The entire course ships on a small number of pallets. Local labour handles install under supervision from a Wacky Works project manager, no messy on-site fabrication, no production interruption to your venue.

Lead time is typically 10–14 weeks from deposit to delivery.`,
      planImage: borough('layout-plan-top.webp'),   // top-down plan of the course
      planIsoImage: borough('layout-plan-iso.webp'), // isometric 3D view
    },

    costs: {
      eyebrow: 'Investment',
      headline: 'Three ways to deliver this course',
      body: `All prices exclude VAT. Three options, from a straight container hand-off through to full workshop redux, storage and install.`,
      packages: [
        {
          name: 'Delivered As-Is',
          total: '£20k',
          blurb:
            'A container of the existing course delivered to Live Nation. You handle installation and touch-up paint where needed. Fastest route and lowest cost.',
          lines: [
            { item: 'Course', amount: '£15k' },
            { item: 'Container delivery', amount: '£5k' },
          ],
        },
        {
          name: 'Workshop Redux',
          total: '£30k',
          blurb:
            'Plonk takes the course into our workshop, repaints and cleans it down, then delivers it in January ready for Live Nation to store and install. Not restored to mint, it stays a second-hand course, but visibly refreshed.',
          lines: [
            { item: 'Course', amount: '£15k' },
            { item: 'Redux (repaint + clean)', amount: '£10k' },
            { item: 'Container delivery', amount: '£5k' },
          ],
        },
        {
          name: 'Full Redux · Stored · Installed',
          total: '£42k',
          blurb:
            'Full workshop redux, stored by Plonk through to summer, then installed and delivered to a London venue of your choice, ready for events.',
          lines: [
            { item: 'Course (upfront)', amount: '£15k' },
            { item: 'Continued storage', amount: '£7k' },
            { item: 'Redux', amount: '£10k' },
            { item: 'Install (London)', amount: '£5k' },
            { item: 'Delivery (London)', amount: '£5k' },
          ],
        },
      ],
      footnote:
        'Second-hand 9-hole course. Prices are the course only, equipment (clubs, balls, scorecards, pencils, signs) can be quoted on request.',
    },
  },
}

export function getPresentation(slug) {
  return PRESENTATIONS[slug] || null
}
