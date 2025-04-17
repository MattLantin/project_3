const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

document.querySelectorAll('.btn').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault(); // ensures it never tries to redirect
    });
  });