const AudioManager = (() => {
  let _ctx    = null;
  let _gain   = null;
  let _buffer = null;
  let _ready  = false;

  const _loadBuffer = async () => {
    try {
      const res = await fetch(AUDIO_SRC);
      if (!res.ok) return;
      _buffer = await _ctx.decodeAudioData(await res.arrayBuffer());
      _ready  = true;
    } catch (_) {}
  };

  const _initContext = () => {
    if (_ctx) return;
    try {
      _ctx  = new (window.AudioContext || window.webkitAudioContext)();
      _gain = _ctx.createGain();
      _gain.gain.value = AUDIO_VOLUME;
      _gain.connect(_ctx.destination);
    } catch (_) { return; }
    _loadBuffer();
  };

  const playClick = () => {
    _initContext();
    if (!_ready || !_ctx || !_buffer) return;
    if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
    try {
      const src = _ctx.createBufferSource();
      src.buffer = _buffer;
      src.connect(_gain);
      src.start(0);
    } catch (_) {}
  };

  return { playClick };
})();
