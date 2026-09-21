/* Runtime layout + overlay fixes. Loaded with `defer` so it runs after the
   page's inline scripts have finished rearranging the DOM. */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Injected stylesheet. Appended last, so its !important rules win any cascade
  // tie against the rules baked into the page.
  // ---------------------------------------------------------------------------
  var css = [
    '/* Brain-injury page: absolute 2x2 grid that out-specifies the older',
    '   .brainScene>.speech{position:relative} rule baked into the page. */',
    '.page[data-page="11"] .brainScene.brainScene>.speech{position:absolute!important;z-index:60!important;width:220px!important;max-width:220px!important;}',
    '.page[data-page="11"] .brainScene.brainScene>.speech:nth-child(3){left:8%!important;right:auto!important;top:72px!important;}',
    '.page[data-page="11"] .brainScene.brainScene>.speech:nth-child(4){right:8%!important;left:auto!important;top:72px!important;}',
    '.page[data-page="11"] .brainScene.brainScene>.speech:nth-child(5){left:8%!important;right:auto!important;top:170px!important;}',
    '.page[data-page="11"] .brainScene.brainScene>.speech:nth-child(6){right:8%!important;left:auto!important;top:170px!important;}',
    '@media(max-width:600px){',
    ' .page[data-page="11"] .brainScene.brainScene>.speech:nth-child(3){left:3%!important;right:auto!important;top:80px!important;width:44%!important;}',
    ' .page[data-page="11"] .brainScene.brainScene>.speech:nth-child(4){right:3%!important;left:auto!important;top:80px!important;width:44%!important;}',
    ' .page[data-page="11"] .brainScene.brainScene>.speech:nth-child(5){left:3%!important;right:auto!important;top:165px!important;width:44%!important;}',
    ' .page[data-page="11"] .brainScene.brainScene>.speech:nth-child(6){right:3%!important;left:auto!important;top:165px!important;width:44%!important;}',
    '}',
    '/* jogu.png / nanamei.png render as faint overlays inside the brain',
    '   artwork and the CT icon. The <img> elements are added by this script',
    '   and self-remove if the files are missing. */',
    '.brainWrap,.ctIcon{isolation:isolate;}',
    '.icon-overlay{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:.22;z-index:2;pointer-events:none;}',
    '/* First-page Jordan speech: keep it centered, contained, and below the icon. */',
    '.page[data-page="0"] .person-card{min-height:340px!important;}'
  ].join('\n');
  var styleEl = document.createElement('style');
  styleEl.id = 'buffyRuntimeFixes';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---------------------------------------------------------------------------
  // Cardiac-arrest page: the inline arrange script grabs
  // `.arrestScene>.speech` (the brain bubble) and appendChild()s it into
  // `.heartWrap`, which centers it on top of the heart bubble. Undo that:
  // return it to the scene so the existing
  // `.arrestScene>.moved-brain-speech{left:4%;bottom:56px}` rule applies.
  // ---------------------------------------------------------------------------
  var arrestPage = document.querySelector('.page[data-page="9"]');
  var arrestScene = arrestPage && arrestPage.querySelector('.arrestScene');
  var stolenBubble = arrestScene && arrestScene.querySelector('.heartWrap .moved-brain-speech');
  if (stolenBubble) {
    ['left', 'right', 'top', 'bottom', 'transform', 'width', 'max-width'].forEach(function (prop) {
      stolenBubble.style.removeProperty(prop);
    });
    arrestScene.appendChild(stolenBubble);
  }

  // ---------------------------------------------------------------------------
  // Brain/CT photo overlays: only render when the image files actually exist.
  // ---------------------------------------------------------------------------
  var brainPage = document.querySelector('.page[data-page="11"]');
  if (brainPage) {
    var targets = [
      [brainPage.querySelector('.brainWrap'), 'jogu.png', 'jogu overlay inside the brain illustration'],
      [brainPage.querySelector('.ctIcon'), 'nanamei.png', 'nanamei overlay inside the CT icon']
    ];
    targets.forEach(function (entry) {
      var host = entry[0];
      var src = entry[1];
      var alt = entry[2];
      if (!host || host.querySelector('.icon-overlay')) return;
      var img = document.createElement('img');
      img.className = 'icon-overlay';
      img.src = src;
      img.alt = alt;
      img.decoding = 'async';
      img.loading = 'lazy';
      img.addEventListener('error', function () { img.remove(); });
      host.appendChild(img);
    });
  }

  var jordanSpeech = document.querySelector('.page[data-page="0"] .person-card > .speech');
  if (jordanSpeech) {
    [
      ['left', '50%'],
      ['right', 'auto'],
      ['top', 'auto'],
      ['bottom', '14px'],
      ['transform', 'translateX(-50%)'],
      ['width', '256px'],
      ['min-width', '0'],
      ['max-width', '256px'],
      ['padding', '8px 12px'],
      ['font-size', 'clamp(12px, 2.8vw, 14.5px)'],
      ['line-height', '1.2'],
      ['text-align', 'center'],
      ['overflow-wrap', 'anywhere']
    ].forEach(function (entry) {
      jordanSpeech.style.setProperty(entry[0], entry[1], 'important');
    });
  }
})();
