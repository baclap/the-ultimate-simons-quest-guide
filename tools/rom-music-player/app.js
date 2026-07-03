import { MUSIC_DATA } from './music-data.js';

const SCOPE_FRAME_WINDOW = 45;
const LOOP_PULSE_MS = 420;
const HIDDEN_SOUND_IDS = new Set([0x2f]);
const TRACK_OVERRIDES = new Map([
  [0x39, { label: 'Daytime Town' }],
  [0x3d, { label: 'Bloody Tears / Daytime Overworld' }],
  [0x41, { label: 'Nighttime' }],
  [0x45, { label: 'Mansion' }],
  [0x49, { label: 'Inside Castlevania' }],
  [0x4d, { label: 'Dracula Battle' }],
  [0x51, { label: 'Death', playbackEndFrame: 306, canLoop: false }],
  [0x55, { label: 'Start Screen' }],
  [0x59, { label: 'Ending', playbackStartFrame: 1537, playbackEndFrame: 5466, canLoop: false }]
]);

const dom = {
  trackSelect: document.querySelector('#track-select'),
  playButton: document.querySelector('#play-button'),
  stopButton: document.querySelector('#stop-button'),
  status: document.querySelector('#status'),
  writeCount: document.querySelector('#write-count'),
  sourceHash: document.querySelector('#source-hash'),
  scope: document.querySelector('#scope'),
  timeline: document.querySelector('.timeline'),
  timelineReadout: document.querySelector('.timeline-readout'),
  timelineFill: document.querySelector('#timeline-fill'),
  timelineLoop: document.querySelector('#timeline-loop'),
  timelinePlayhead: document.querySelector('#timeline-playhead'),
  positionReadout: document.querySelector('#position-readout'),
  loopReadout: document.querySelector('#loop-readout'),
  meters: [
    document.querySelector('#pulse-one-meter'),
    document.querySelector('#pulse-two-meter'),
    document.querySelector('#triangle-meter'),
    document.querySelector('#noise-meter')
  ]
};

let audioContext = null;
let apuNode = null;
let currentTrack = null;
let currentFrames = [];
let currentFrameIndex = 0;
let currentWriteCount = 0;
let currentLoopCount = 0;
let displayedLoopCount = 0;
let playbackFinished = false;
let loopPulseTimer = null;
let visibleTracks = [];

function hex(value, width = 2) {
  return `$${value.toString(16).toUpperCase().padStart(width, '0')}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(frame) {
  const totalSeconds = Math.max(0, frame) / MUSIC_DATA.frameRate;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const centiseconds = Math.floor((totalSeconds % 1) * 100);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

function setStatus(message) {
  dom.status.textContent = message;
}

function formatTrack(track) {
  const loopLabel = track.canLoop === false
    ? 'one-shot'
    : track.loop.verified
    ? `loop ${track.loop.startFrame}-${track.loop.endFrame - 1}`
    : `fallback loop ${track.loop.startFrame}-${track.loop.endFrame - 1}`;
  return `${track.label} - ${track.channels} channels - ${loopLabel}`;
}

function decorateTrack(track) {
  const override = TRACK_OVERRIDES.get(track.soundId) || {};
  return {
    ...track,
    label: override.label || track.label,
    playbackStartFrame: override.playbackStartFrame || 0,
    playbackEndFrame: override.playbackEndFrame || track.loop.endFrame,
    canLoop: override.canLoop !== false
  };
}

function expandTrack(track) {
  if (track.expandedFrames) {
    return track.expandedFrames;
  }
  const frames = Array.from({ length: track.frameCount }, () => []);
  let frameIndex = 0;
  for (let index = 0; index < track.events.length; index += 3) {
    frameIndex += track.events[index];
    const register = track.events[index + 1];
    const value = track.events[index + 2];
    if (frames[frameIndex]) {
      frames[frameIndex].push(register, value);
    }
  }
  track.expandedFrames = frames;
  return frames;
}

function populateTracks() {
  visibleTracks = MUSIC_DATA.tracks
    .filter((track) => !HIDDEN_SOUND_IDS.has(track.soundId))
    .map(decorateTrack);
  dom.trackSelect.innerHTML = '';
  for (const track of visibleTracks) {
    const option = document.createElement('option');
    option.value = String(track.soundId);
    option.textContent = formatTrack(track);
    dom.trackSelect.append(option);
  }
  dom.trackSelect.disabled = visibleTracks.length === 0;
  dom.playButton.disabled = visibleTracks.length === 0;
  dom.sourceHash.textContent = MUSIC_DATA.source.romSha256;
  if (visibleTracks.length === 0) {
    setStatus('No generated music tracks were found.');
    return;
  }
  setStatus(`Loaded ${visibleTracks.length} ROM-derived music tracks. No ROM required at runtime.`);
}

async function ensureAudio() {
  if (audioContext && apuNode) return;
  audioContext = new AudioContext({ latencyHint: 'interactive' });
  await audioContext.audioWorklet.addModule('apu-worklet.js');
  apuNode = new AudioWorkletNode(audioContext, 'cv2-apu', {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2]
  });
  apuNode.port.onmessage = (event) => {
    if (event.data.type !== 'status') return;
    currentWriteCount = event.data.writeCount || 0;
    dom.writeCount.textContent = String(currentWriteCount);
    updateMeters(event.data.regs);
    updatePlaybackPosition(event.data.position, event.data);
  };
  apuNode.connect(audioContext.destination);
}

function selectedTrack() {
  const soundId = Number.parseInt(dom.trackSelect.value, 10);
  return visibleTracks.find((track) => track.soundId === soundId) || visibleTracks[0] || null;
}

function trackEndFrame(track) {
  return track.playbackEndFrame || track.loop.endFrame;
}

function finishPlayback(track) {
  playbackFinished = true;
  dom.stopButton.disabled = true;
  updateMeters(new Array(0x18).fill(0));
  setStatus(`Finished ${track.label}.`);
  currentTrack = null;
}

async function play() {
  currentTrack = selectedTrack();
  if (!currentTrack) return;
  await ensureAudio();
  await audioContext.resume();

  currentFrames = expandTrack(currentTrack);
  currentFrameIndex = currentTrack.playbackStartFrame || 0;
  currentWriteCount = 0;
  currentLoopCount = 0;
  displayedLoopCount = 0;
  playbackFinished = false;
  dom.writeCount.textContent = '0';
  updateTimeline(currentTrack, { sourceFrame: currentFrameIndex, loopCount: 0 });
  drawScopeAround(currentFrameIndex);
  apuNode.port.postMessage({ type: 'reset' });
  apuNode.port.postMessage({
    type: 'track',
    frames: currentFrames,
    startFrame: currentFrameIndex,
    endFrame: trackEndFrame(currentTrack),
    loopStartFrame: currentTrack.loop.startFrame,
    loopEndFrame: currentTrack.loop.endFrame,
    canLoop: currentTrack.canLoop !== false,
    dmcSamples: MUSIC_DATA.dmcSamples || []
  });
  apuNode.port.postMessage({ type: 'play' });
  dom.stopButton.disabled = false;
  setStatus(`Playing ${currentTrack.label} from generated APU writes built from ROM driver ${hex(MUSIC_DATA.driver.trigger, 4)}.`);
}

function stop() {
  currentTrack = null;
  currentFrames = [];
  currentFrameIndex = 0;
  currentLoopCount = 0;
  displayedLoopCount = 0;
  playbackFinished = false;
  if (apuNode) {
    apuNode.port.postMessage({ type: 'stop' });
  }
  dom.stopButton.disabled = true;
  updateMeters(new Array(0x18).fill(0));
  updateTimeline(selectedTrack(), { sourceFrame: selectedTrack()?.playbackStartFrame || 0, loopCount: 0 });
  setStatus(`Loaded ${visibleTracks.length} ROM-derived music tracks. No ROM required at runtime.`);
}

function pulseLoop() {
  dom.timeline.classList.add('loop-pulse');
  dom.timelineReadout.classList.add('loop-pulse');
  if (loopPulseTimer !== null) {
    window.clearTimeout(loopPulseTimer);
  }
  loopPulseTimer = window.setTimeout(() => {
    dom.timeline.classList.remove('loop-pulse');
    dom.timelineReadout.classList.remove('loop-pulse');
    loopPulseTimer = null;
  }, LOOP_PULSE_MS);
}

function updatePlaybackPosition(position, status) {
  if (!currentTrack || !position) return;
  if (position.loopCount > displayedLoopCount) {
    pulseLoop();
  }
  currentFrameIndex = position.sourceFrame;
  currentLoopCount = position.loopCount;
  displayedLoopCount = position.loopCount;
  updateTimeline(currentTrack, position);
  drawScopeAround(position.sourceFrame);
  if (
    currentTrack.canLoop === false
    && !playbackFinished
    && status.finished
  ) {
    finishPlayback(currentTrack);
  }
}

function updateTimeline(track, position = { sourceFrame: 0, loopCount: 0 }) {
  if (!track) {
    dom.timelineFill.style.width = '0%';
    dom.timelineLoop.style.left = '0%';
    dom.timelineLoop.style.width = '0%';
    dom.timelineLoop.style.display = 'none';
    dom.timelinePlayhead.style.left = '0%';
    dom.positionReadout.textContent = '00:00.00 / 00:00.00';
    dom.loopReadout.textContent = 'Loop 0';
    return;
  }

  const startFrame = track.playbackStartFrame || 0;
  const durationFrame = Math.max(startFrame + 1, trackEndFrame(track));
  const visibleDurationFrame = Math.max(1, durationFrame - startFrame);
  const sourceFrame = clamp(position.sourceFrame ?? startFrame, startFrame, durationFrame);
  const displayFrame = sourceFrame >= durationFrame - 1 ? durationFrame : sourceFrame;
  const relativeFrame = displayFrame - startFrame;
  const progressPercent = clamp(relativeFrame / visibleDurationFrame * 100, 0, 100);
  const loopStartPercent = track.canLoop === false
    ? 0
    : clamp((track.loop.startFrame - startFrame) / visibleDurationFrame * 100, 0, 100);
  const loopWidthPercent = track.canLoop === false
    ? 0
    : clamp((track.loop.endFrame - Math.max(track.loop.startFrame, startFrame)) / visibleDurationFrame * 100, 0, 100);
  const loopLabel = track.canLoop === false
    ? 'Ends'
    : track.loop.verified ? `Loop ${position.loopCount ?? 0}` : `Loop ${position.loopCount ?? 0}*`;

  dom.timelineFill.style.width = `${progressPercent}%`;
  dom.timelineLoop.style.display = track.canLoop === false ? 'none' : 'block';
  dom.timelineLoop.style.left = `${loopStartPercent}%`;
  dom.timelineLoop.style.width = `${loopWidthPercent}%`;
  dom.timelinePlayhead.style.left = `${progressPercent}%`;
  dom.positionReadout.textContent = `${formatTime(relativeFrame)} / ${formatTime(visibleDurationFrame)}`;
  dom.loopReadout.textContent = loopLabel;
}

function updateMeters(regs) {
  const pulseOne = (regs[0x15] & 0x01) ? ((regs[0x00] & 0x0f) / 15) : 0;
  const pulseTwo = (regs[0x15] & 0x02) ? ((regs[0x04] & 0x0f) / 15) : 0;
  const triangle = (regs[0x15] & 0x04) ? 1 : 0;
  const noise = (regs[0x15] & 0x08) ? ((regs[0x0c] & 0x0f) / 15) : 0;
  [pulseOne, pulseTwo, triangle, noise].forEach((level, index) => {
    dom.meters[index].style.transform = `scaleX(${Math.max(0, Math.min(1, level)).toFixed(3)})`;
  });
}

function drawScope(frames) {
  const ctx = dom.scope.getContext('2d');
  const width = dom.scope.width;
  const height = dom.scope.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#fffeff';
  const columns = Math.max(1, frames.length);
  frames.forEach((frame, index) => {
    const x = Math.floor(index / columns * width);
    const barHeight = Math.min(height, frame.length / 2 * 6);
    ctx.fillRect(x, height - barHeight, Math.max(1, Math.ceil(width / columns)), barHeight);
  });
  ctx.fillStyle = '#f7d547';
  ctx.fillRect(0, height - 1, width, 1);
}

function drawScopeAround(sourceFrame) {
  if (!currentFrames.length) {
    drawScope([]);
    return;
  }
  const startFrame = clamp(sourceFrame, 0, Math.max(0, currentFrames.length - 1));
  drawScope(currentFrames.slice(startFrame, startFrame + SCOPE_FRAME_WINDOW));
}

dom.playButton.addEventListener('click', () => {
  play().catch((error) => setStatus(error instanceof Error ? error.message : String(error)));
});

dom.stopButton.addEventListener('click', stop);

dom.trackSelect.addEventListener('change', () => {
  if (currentTrack !== null) {
    play().catch((error) => setStatus(error instanceof Error ? error.message : String(error)));
  } else {
    updateTimeline(selectedTrack(), { sourceFrame: selectedTrack()?.playbackStartFrame || 0, loopCount: 0 });
  }
});

populateTracks();
drawScope([]);
updateTimeline(selectedTrack(), { sourceFrame: selectedTrack()?.playbackStartFrame || 0, loopCount: 0 });

window.cv2MusicDemo = {
  play,
  stop,
  state() {
    return {
      currentSoundId: currentTrack?.soundId ?? null,
      currentWriteCount,
      currentFrameIndex,
      currentLoopCount,
      trackCount: visibleTracks.length,
      source: MUSIC_DATA.source,
      tracks: visibleTracks.map((track) => ({
        soundId: track.soundId,
        label: track.label,
        channels: track.channels,
        frameCount: track.frameCount,
        playbackStartFrame: track.playbackStartFrame,
        playbackEndFrame: track.playbackEndFrame,
        canLoop: track.canLoop,
        writeCount: track.writeCount,
        loop: track.loop,
        table: track.table
      }))
    };
  }
};
