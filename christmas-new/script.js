        const decorContainer = document.getElementById('decor');
        const items = ['❄', '❅', '❆', '🎁', '🔔', '⭐'];

        function createDecor() {
            for (let i = 0; i < 50; i++) {
                const item = document.createElement('div');
                item.className = 'item';
                item.innerHTML = items[Math.floor(Math.random() * items.length)];
                item.style.left = Math.random() * 100 + 'vw';
                item.style.fontSize = (Math.random() * 20 + 10) + 'px';
                item.style.animationDuration = (Math.random() * 3 + 2) + 's';
                item.style.animationDelay = Math.random() * 5 + 's';
                decorContainer.appendChild(item);
            }
        }

        function toggleEnvelope() {
            const wrapper = document.querySelector('.envelope-wrapper');
            const audio = document.getElementById('jingleBells');
            const title = document.querySelector('.page-title');

            wrapper.classList.toggle('open');

            if (wrapper.classList.contains('open')) {
                audio.play();
                title.classList.add('hidden');
            } else {
                audio.pause();
                audio.currentTime = 0;
                title.classList.remove('hidden');
            }
        }

        createDecor();