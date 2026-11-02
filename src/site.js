// Calculators dropdown: opens on click, closes on outside click, Escape, or choosing a link.
(function () {
  var btn = document.getElementById('menuBtn');
  var list = document.getElementById('menuList');
  if (!btn || !list) return;

  function setOpen(open, returnFocus) {
    btn.setAttribute('aria-expanded', String(open));
    list.hidden = !open;
    if (!open && returnFocus) btn.focus();
  }

  btn.addEventListener('click', function () {
    setOpen(list.hidden);
  });
  document.addEventListener('click', function (e) {
    if (!list.hidden && !btn.contains(e.target) && !list.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !list.hidden) setOpen(false, true);
  });
  list.addEventListener('focusout', function (e) {
    if (!list.hidden && e.relatedTarget && !list.contains(e.relatedTarget) && e.relatedTarget !== btn) setOpen(false);
  });
})();
