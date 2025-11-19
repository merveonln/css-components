const follower = document.querySelector('.cursor-follower');
const waveText = document.querySelector('.wave-text');

document.addEventListener('mousemove', (e) => {
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';

    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 1000);
});

waveText.addEventListener('mouseenter', () => {
    waveText.classList.add('active');
});

waveText.addEventListener('mouseleave', () => {
    waveText.classList.remove('active');
});
