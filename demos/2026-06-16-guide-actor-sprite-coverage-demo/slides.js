(function () {
  'use strict';

  const evidence = window.GUIDE_ACTOR_SPRITE_COVERAGE;
  const deck = document.getElementById('deck');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const progress = document.getElementById('progress');

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function code(value) {
    return `<code>${escapeHtml(value)}</code>`;
  }

  function tag(value, tone = '') {
    return `<span class="tag ${tone}">${escapeHtml(value)}</span>`;
  }

  function metric(value, label) {
    return `<article class="metric"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></article>`;
  }

  function spriteSrc(image) {
    return `assets/${image}`;
  }

  function firstRow(actor) {
    return actor.rows && actor.rows.length ? actor.rows[0] : {};
  }

  function selectorTags(actor) {
    if (actor.sprite?.record?.selectors) {
      return actor.sprite.record.selectors.map((selector) => tag(selector, 'gold')).join('');
    }
    if (actor.sprites) {
      return actor.sprites.map((sprite) => tag(sprite.record?.selectors?.join(' / ') || sprite.selector, 'gold')).join('');
    }
    return tag('no sprite', 'red');
  }

  function spriteBlock(actor) {
    if (actor.sprite?.image) {
      return `
        <div class="sprite-stage">
          <img src="${escapeHtml(spriteSrc(actor.sprite.image))}" alt="${escapeHtml(actor.label)} sprite strip">
        </div>
      `;
    }

    if (actor.sprites) {
      return `
        <div class="sprite-stage">
          <div class="dual-sprite">
            ${actor.sprites.map((sprite) => `<img src="${escapeHtml(spriteSrc(sprite.image))}" alt="${escapeHtml(actor.label)} sprite">`).join('')}
          </div>
        </div>
      `;
    }

    return '<div class="sprite-stage compact"><div class="empty-sprite">$00</div></div>';
  }

  function actorCard(actor, opts = {}) {
    const row = firstRow(actor);
    const hp = actor.hp
      ? `HP ${actor.hp.day == null ? 'day off' : actor.hp.day} / ${actor.hp.night} night`
      : `${actor.rows?.length || 0} row${actor.rows?.length === 1 ? '' : 's'}`;
    const text = row.text ? `<p class="micro">${escapeHtml(row.text)}</p>` : '';
    const record = actor.sprite?.record?.cpuAddress ? tag(actor.sprite.record.cpuAddress, 'good') : '';
    const locationTags = (actor.locations || []).slice(0, 3).map((location) => tag(location)).join('');

    return `
      <article class="actor-card">
        <h3>${escapeHtml(actor.label)} <span class="actor-id">${escapeHtml(actor.actorId)}</span></h3>
        ${spriteBlock(actor)}
        <div class="tag-row">
          ${selectorTags(actor)}
          ${record}
          ${tag(hp, actor.hp ? 'good' : '')}
        </div>
        ${locationTags ? `<div class="tag-row">${locationTags}</div>` : ''}
        ${opts.showRows && row.offset ? `<p class="micro">First ROM row ${code(row.offset)}: ${row.rawBytes.map((byte) => code(byte)).join(' ')}</p>` : ''}
        ${text}
      </article>
    `;
  }

  function townTable() {
    const rows = evidence.townActors.flatMap((actor) => actor.rows.map((row) => ({ actor, row })));
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Actor</th>
              <th>ROM row</th>
              <th>Map position</th>
              <th>Guide text</th>
              <th>Sprite result</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(({ actor, row }) => `
              <tr>
                <td>${escapeHtml(actor.label)}<br>${code(actor.actorId)} -> live ${code(actor.liveId)}</td>
                <td>${code(row.offset)}<br>${row.rawBytes.map((byte) => code(byte)).join(' ')}</td>
                <td>${escapeHtml(row.tileX)}, ${escapeHtml(row.tileY)} tiles<br>${escapeHtml(row.pixelX)}, ${escapeHtml(row.pixelY)} px</td>
                <td>${escapeHtml(row.text)}</td>
                <td>${actor.sprite ? actor.sprite.record.selectors.map((selector) => code(selector)).join(' / ') : 'fixture: selector ' + escapeHtml(actor.noSprite.selector) + ', 0 sprites'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function integrationTable() {
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Guide need</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${evidence.integrationStatus.map((item) => `
              <tr>
                <td>${escapeHtml(item.item)}</td>
                <td>${tag(item.status, item.status.startsWith('covered') ? 'good' : 'gold')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  const townNpcActors = evidence.townActors.filter((actor) => actor.kind === 'npc');
  const sign = evidence.townActors.find((actor) => actor.key === 'jova-sign');

  const slides = [
    {
      id: 'result',
      kicker: 'End result',
      title: 'The current guide slice has complete actor sprite coverage.',
      lead: 'This milestone closes the remaining Jova town actor-art gaps without promoting guessed sprites. Each rendered character is tied to ROM rows, dispatch code, selector records, CHR tiles, and palette evidence.',
      body: `
        <section class="metric-row">
          ${metric(evidence.summary.status, 'coverage state')}
          ${metric(evidence.summary.renderedActorClasses, 'rendered actor classes')}
          ${metric(evidence.summary.noSpriteFixtures, 'proven no-sprite fixture')}
          ${metric(evidence.summary.missing, 'missing classes')}
        </section>
        <section class="grid-2">
          <article class="panel">
            <h3>Newly closed</h3>
            <p class="micro">Jova ${code('0xAA')} man, Jova ${code('0xA8')} clue NPC, and the ${code('0xA4')} sign fixture are now resolved from ROM evidence.</p>
          </article>
          <article class="panel">
            <h3>No shortcuts</h3>
            <p class="micro">${escapeHtml(evidence.shortcuts.length ? evidence.shortcuts.join(', ') : 'No shortcut entries are recorded in this evidence bundle.')}</p>
          </article>
        </section>
      `
    },
    {
      id: 'evidence-chain',
      kicker: 'How to trust it',
      title: 'The path is row bytes to live id to selector to pixels.',
      lead: 'The demo is high-level, but the generated evidence keeps the chain inspectable. The important part is that the sprite image is the last step, not the source.',
      body: `
        <ul class="provenance-list">
          ${evidence.provenance.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      `
    },
    {
      id: 'town-sprites',
      kicker: 'Town of Jova',
      title: 'Every daytime town person now has a rendered sprite strip.',
      lead: 'The Jova man and the $A8 clue NPC both resolve to selector record $0D, which emits selectors $22/$23. Shepherd and merchant remain covered by their earlier runtime-calibrated bindings.',
      body: `<section class="grid-4">${townNpcActors.map((actor) => actorCard(actor, { showRows: true })).join('')}</section>`
    },
    {
      id: 'town-text',
      kicker: 'Guide data',
      title: 'The click targets can carry real placement and dialog.',
      lead: 'For the guide UI, the useful output is not just the sprite. It is the row coordinate, row data byte, decoded text, and the sprite or fixture status packaged together.',
      body: townTable()
    },
    {
      id: 'enemy-sprites',
      kicker: 'Enemies',
      title: 'The guide-slice enemies have ROM-rendered sprites and HP.',
      lead: 'Skeleton, fishman, werewolf, and zombie are covered. The HP values are still the row-data rules from the previous catalog work; this milestone fills in the art coverage beside them.',
      body: `<section class="grid-4">${evidence.enemies.map((actor) => actorCard(actor)).join('')}</section>`
    },
    {
      id: 'sign-fixture',
      kicker: 'Important non-sprite',
      title: 'The Jova sign is a fixture, not a missing sprite.',
      lead: 'The sign row is still guide data, but the ROM does not draw it as an actor. Dispatch entry $24 calls the fixed helper with selector $00, and selector $00 contains zero metasprite entries.',
      body: `
        <section class="grid-2">
          ${actorCard(sign, { showRows: true })}
          <article class="panel">
            <h3>Fixture proof <span class="actor-id">${escapeHtml(sign.noSprite.selector)}</span></h3>
            <p class="micro">Fixed helper ${code(sign.noSprite.ded0Address)} bytes: ${sign.noSprite.ded0Bytes.map((byte) => code(byte)).join(' ')}</p>
            <div class="tag-row">
              ${tag(`${sign.noSprite.selectorCount} metasprite entries`, 'good')}
              ${tag('background-backed click target', 'gold')}
            </div>
            <p class="micro">${escapeHtml(sign.noSprite.meaning)}</p>
          </article>
        </section>
      `
    },
    {
      id: 'integration',
      kicker: 'Next handoff',
      title: 'This is ready to feed the interactive guide prototype.',
      lead: 'For this slice, the remaining work moves from discovery into product integration: actor overlay data, toggleable NPC/enemy layers, click behavior, and day/night state handling.',
      body: integrationTable()
    }
  ];

  let current = 0;

  function renderSlides() {
    deck.innerHTML = slides.map((slide, index) => `
      <section class="slide" id="${escapeHtml(slide.id)}" data-index="${index}" aria-labelledby="${escapeHtml(slide.id)}-title">
        <p class="slide-kicker">${escapeHtml(slide.kicker)}</p>
        <h2 id="${escapeHtml(slide.id)}-title">${escapeHtml(slide.title)}</h2>
        <p class="lead">${escapeHtml(slide.lead)}</p>
        ${slide.body}
      </section>
    `).join('');
  }

  function show(index, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    document.querySelectorAll('.slide').forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === current);
    });
    progress.textContent = `${current + 1} / ${slides.length}`;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    if (updateHash) {
      history.replaceState(null, '', `#${slides[current].id}`);
    }
  }

  function fromHash() {
    const id = window.location.hash.replace(/^#/, '');
    const index = slides.findIndex((slide) => slide.id === id);
    return index >= 0 ? index : 0;
  }

  renderSlides();
  show(fromHash(), false);

  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  window.addEventListener('hashchange', () => show(fromHash(), false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      show(current - 1);
    } else if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      show(current + 1);
    }
  });
}());
