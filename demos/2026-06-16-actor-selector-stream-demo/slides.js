'use strict';

const evidence = window.ACTOR_SELECTOR_STREAM_EVIDENCE;
const deck = document.getElementById('deck');
const progress = document.getElementById('progress');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

function el(tag, className, children = []) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child == null) {
      continue;
    }
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

function code(text) {
  return el('code', 'code', text);
}

function spritePath(actor) {
  const output = actor.sprite && actor.sprite.output ? actor.sprite.output : '';
  return `assets/sprites/${output.split('/').pop()}`;
}

function hpPills(actor) {
  if (!actor.hpByNight || actor.hpByNight.length === 0) {
    return el('span', 'pill', 'HP not observed');
  }

  return actor.hpByNight.map((entry) => {
    const label = entry.night === '0x00' ? 'day' : 'night';
    return el('span', 'pill', `${label} HP ${entry.hpValues.join(', ')}`);
  });
}

function actorCard(actor) {
  const img = el('img');
  img.src = spritePath(actor);
  img.alt = `${actor.label} sprite strip`;
  img.loading = 'lazy';

  return el('article', 'actor-card', [
    el('h3', null, [
      el('span', null, actor.label),
      el('span', 'actor-id', actor.actorId)
    ]),
    el('div', 'sprite-stage', img),
    el('div', 'pill-row', hpPills(actor)),
    el('ul', 'meta-list', [
      el('li', null, ['Record ', code(actor.selectorRecord.cpuAddress), ': ', code(actor.selectorRecord.bytes.join(' '))]),
      el('li', null, ['Selectors ', code(actor.selectorRecord.selectors.join(' / '))]),
      el('li', null, ['Rendered from ', code(actor.sprite.sourceTrace || 'trace capture'), ' CHR/palette memory'])
    ])
  ]);
}

function metric(value, label) {
  return el('div', 'metric', [
    el('strong', null, value),
    el('span', null, label)
  ]);
}

function actorById(id) {
  return evidence.promotedActors.find((actor) => actor.actorId === id);
}

function compactActorRow(actor) {
  const tr = el('tr');
  tr.append(
    el('td', null, [code(actor.actorId)]),
    el('td', null, actor.label),
    el('td', null, [code(actor.selectorRecord.cpuAddress)]),
    el('td', null, [code(actor.selectorRecord.selectors.join(' / '))]),
    el('td', null, actor.hpByNight.map((entry) => {
      const label = entry.night === '0x00' ? 'day' : 'night';
      return `${label}: ${entry.hpValues.join(', ')}`;
    }).join('; '))
  );
  return tr;
}

function recordTable(actors) {
  const tbody = el('tbody');
  for (const actor of actors) {
    tbody.append(compactActorRow(actor));
  }
  return el('table', 'record-table', [
    el('thead', null, el('tr', null, [
      el('th', null, 'Actor'),
      el('th', null, 'Label'),
      el('th', null, 'ROM record'),
      el('th', null, 'Frames'),
      el('th', null, 'Observed HP')
    ])),
    tbody
  ]);
}

function slideShell(slide) {
  const section = el('section', 'slide');
  section.id = slide.id;
  section.append(
    el('p', 'slide-kicker', slide.kicker),
    el('h2', null, slide.title)
  );
  if (slide.lead) {
    section.append(el('p', 'lead', slide.lead));
  }
  section.append(slide.render());
  return section;
}

const jovaActors = ['0x03', '0x13', '0x17'].map(actorById).filter(Boolean);
const broaderActors = ['0x05', '0x38', '0x3A'].map(actorById).filter(Boolean);

const slides = [
  {
    id: 'result',
    kicker: 'Meaningful result',
    title: 'Six actor classes now render from ROM selector streams.',
    lead: 'This milestone turns the trace clue at $DD7D into repeatable ROM-side data: actor id, selector-stream record, animation selectors, HP observations, and rendered sprite strips.',
    render() {
      return el('div', null, [
        el('div', 'metric-row', [
          metric(evidence.summary.actorRecords, 'selector-stream records mapped'),
          metric(evidence.summary.renderedSpriteStrips, 'sprite strips rendered'),
          metric(evidence.summary.mismatchedSelectorWrites, 'selector mismatches'),
          metric(evidence.summary.traceFixtures, 'save-state probes used')
        ]),
        el('div', 'sprite-grid', evidence.promotedActors.map(actorCard))
      ]);
    }
  },
  {
    id: 'proof-chain',
    kicker: 'Evidence chain',
    title: 'The save state identifies the actor; the ROM supplies the animation.',
    lead: 'The trace does not become the source of truth. It tells us which live actor id hit the selector writer. The fixed-bank routine and metasprite tables then explain what that actor is drawing.',
    render() {
      return el('div', null, [
        el('div', 'pipeline', [
          el('section', 'pipeline-step', [
            el('h3', null, '1. Runtime trace'),
            el('p', null, ['At ', code('$DD7D'), ', the emulator records actor id, selector value, HP, night flag, and CPU ', code('Y'), '.'])
          ]),
          el('section', 'pipeline-step', [
            el('h3', null, '2. Stream record'),
            el('p', null, ['The routine maps ', code('Y'), ' back to a 3-byte fixed-bank record under ', code('$DDA2'), '.'])
          ]),
          el('section', 'pipeline-step', [
            el('h3', null, '3. Metasprite table'),
            el('p', null, ['Each selector resolves through ROM pointer tables ', code('$AC30'), ' and ', code('$AD30'), '.'])
          ]),
          el('section', 'pipeline-step', [
            el('h3', null, '4. Rendered pixels'),
            el('p', null, 'The sprite strips are drawn from decoded metasprite bytes plus captured PPU CHR and palette memory.')
          ])
        ]),
        el('p', 'callout', 'Practical translation: once an actor class is bound to one of these ROM records, other screens can reuse the same sprite decoder instead of needing a screenshot-specific sprite crop.')
      ]);
    }
  },
  {
    id: 'jova-slice',
    kicker: 'Guide slice impact',
    title: 'Jova Woods and town-night enemies now have ROM-rendered sprites.',
    lead: 'These are the actor classes that matter most for the Jova-to-first-mansion guide slice today: skeleton, werewolf, and town-night zombie.',
    render() {
      return el('div', null, [
        el('div', 'sprite-grid', jovaActors.map(actorCard)),
        recordTable(jovaActors)
      ]);
    }
  },
  {
    id: 'broader-actors',
    kicker: 'Beyond the slice',
    title: 'Three additional trace classes also decode cleanly.',
    lead: 'These are not all guide-named yet. The important end result is that their selector stream records and rendered animation frames are now ROM-backed instead of guessed.',
    render() {
      return el('div', null, [
        el('div', 'sprite-grid', broaderActors.map(actorCard)),
        recordTable(broaderActors)
      ]);
    }
  },
  {
    id: 'boundaries',
    kicker: 'No shortcut ledger',
    title: 'What this solves, and what it deliberately leaves unsolved.',
    lead: 'This milestone is intentionally narrow: it proves actor sprite rendering and animation binding. It does not pretend to finish every enemy/NPC fact needed by the final guide.',
    render() {
      return el('div', null, [
        el('div', 'two-col', [
          el('section', 'boundary-card', [
            el('h3', null, 'Solved here'),
            el('ul', null, [
              el('li', null, 'Actor id to selector-stream record for six observed classes.'),
              el('li', null, 'Selector record bytes, addresses, and frame selectors from fixed-bank ROM.'),
              el('li', null, 'Metasprite rendering through ROM pointer tables.'),
              el('li', null, 'Day/night HP observations retained from runtime actor RAM traces.'),
              el('li', null, 'Zero selector-write mismatches in the decoded evidence bundle.')
            ])
          ]),
          el('section', 'boundary-card', [
            el('h3', null, 'Still next'),
            el('ul', null, [
              el('li', null, 'Full enemy/NPC placement table decode for every screen.'),
              el('li', null, 'NPC/merchant text routine binding and exact dialogue rows.'),
              el('li', null, 'Fishman or other unobserved classes require either placement decode or a targeted trace.'),
              el('li', null, 'Guide-facing names for the generic trace classes need ROM/manual corroboration before polish.')
            ])
          ])
        ]),
        el('p', 'callout', 'Shortcut status: the rendered sprite pixels are not hand-authored PNGs. The remaining gap is not hidden; placement and text are separate ROM-routine milestones.')
      ]);
    }
  }
];

const slideNodes = slides.map(slideShell);
for (const node of slideNodes) {
  deck.append(node);
}

function currentIndexFromHash() {
  const id = window.location.hash.replace(/^#/, '');
  const index = slides.findIndex((slide) => slide.id === id);
  return index === -1 ? 0 : index;
}

let currentIndex = currentIndexFromHash();

function showSlide(index, updateHash = true) {
  currentIndex = Math.max(0, Math.min(slides.length - 1, index));
  for (let i = 0; i < slideNodes.length; i += 1) {
    slideNodes[i].classList.toggle('active', i === currentIndex);
  }
  progress.textContent = `${currentIndex + 1} / ${slides.length}`;
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === slides.length - 1;
  if (updateHash) {
    history.replaceState(null, '', `#${slides[currentIndex].id}`);
  }
}

prevButton.addEventListener('click', () => showSlide(currentIndex - 1));
nextButton.addEventListener('click', () => showSlide(currentIndex + 1));

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
    event.preventDefault();
    showSlide(currentIndex + 1);
  } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    event.preventDefault();
    showSlide(currentIndex - 1);
  }
});

window.addEventListener('hashchange', () => {
  showSlide(currentIndexFromHash(), false);
});

showSlide(currentIndex, !window.location.hash);
