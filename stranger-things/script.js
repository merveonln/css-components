 let currentSeason = 5;
        let musicStarted = false;

        window.addEventListener('DOMContentLoaded', () => {
            const music = document.getElementById('introMusic');
            music.volume = 0.3;
            
            music.src = 'stranger-things-season5.mp3';
            music.load();
            
            const startMusicBtn = document.getElementById('startMusicBtn');
            const startMusicOverlay = document.getElementById('startMusicOverlay');
            
            startMusicBtn.addEventListener('click', () => {
                music.play().then(() => {
                    musicStarted = true;
                }).catch(err => {
                    // console.log('Music play failed:', err);
                });
                
                startMusicBtn.style.transform = 'scale(0)';
                startMusicBtn.style.opacity = '0';
                
                setTimeout(() => {
                    document.body.classList.add('bg-visible');
                    
                    setTimeout(() => {
                        startMusicOverlay.style.opacity = '0';
                        setTimeout(() => {
                            startMusicOverlay.style.display = 'none';
                            const mainContainer = document.getElementById('mainContainer');
                            mainContainer.style.opacity = '1';
                            playIntroAnimation();
                        }, 800);
                    }, 500);
                }, 100);
            });
            
            updateActiveButton(currentSeason);
            
        });

        function changeSeason(season) {
            currentSeason = season;
            
            const body = document.body;
            body.classList.add('bg-transition'); 
            body.classList.add('bg-fade');
            
            setTimeout(() => {
                body.style.setProperty('--bg-image', `url('stranger-things-season${season}.png')`);
                setTimeout(() => {
                    body.classList.remove('bg-fade');
                }, 50);
            }, 300);
            
            const music = document.getElementById('introMusic');
            
            if (!music.paused) {
                music.pause();
            }
            
            music.src = `stranger-things-season${season}.mp3`;
            music.load();
            
            if (musicStarted) {
                setTimeout(() => {
                    music.play().catch(err => {
                        // console.log('Music play failed:', err);
                    });
                }, 100);
            }
            
            const numberDisplay = document.getElementById('numberDisplay');
            numberDisplay.textContent = season;
            
            updateActiveButton(season);
            
            restartIntroAnimation();
        }

        function updateActiveButton(season) {
            const buttons = document.querySelectorAll('.season-btn');
            buttons.forEach(btn => {
                if (btn.dataset.season == season) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        function restartIntroAnimation() {
            const clickText = document.getElementById('clickText');
            clickText.style.opacity = '0';
            clickText.style.pointerEvents = 'none';
            clickText.classList.remove('visible');
            
            document.body.classList.remove('animating');
            
            const mainContainer = document.getElementById('mainContainer');
            mainContainer.style.opacity = '0';
            
            const number = document.getElementById('numberDisplay');
            const bigLetters = document.querySelectorAll('.big-letter');
            const animLetters = document.querySelectorAll('.anim-letter');
            const thingsLetters = document.querySelectorAll('.things .letter');
            const sideLines = document.querySelectorAll('.side-line');
            
            mainContainer.style.animation = 'none';
            mainContainer.style.transform = 'scale(4)';
            
            number.style.animation = 'none';
            number.style.opacity = '0';
            number.style.textShadow = '0 0 0px rgba(255, 0, 0, 0)';
            
            bigLetters[0].style.animation = 'none';
            bigLetters[0].style.opacity = '0';
            bigLetters[0].style.transform = 'translate(-350px, 0px)';
            bigLetters[0].style.filter = 'drop-shadow(0 0 0px rgba(255, 0, 0, 0))';
            
            bigLetters[1].style.animation = 'none';
            bigLetters[1].style.opacity = '0';
            bigLetters[1].style.transform = 'translate(350px, 0px)';
            bigLetters[1].style.filter = 'drop-shadow(0 0 0px rgba(255, 0, 0, 0))';
            
            const middleDelays = [0.8, 1.1, 0.5, 1.3, 0.9, 1.5];
            animLetters.forEach((letter, index) => {
                letter.style.animation = 'none';
                letter.style.opacity = '0';
                letter.style.transform = 'translate(0, -250px)';
                letter.style.filter = 'drop-shadow(0 0 0px rgba(255, 0, 0, 0))';
            });
            
            const thingsDelays = [0.7, 1, 0.4, 1.2, 0.9, 0.6];
            thingsLetters.forEach((letter, index) => {
                letter.style.animation = 'none';
                letter.style.opacity = '0';
                letter.style.transform = 'translate(0px, 250px)';
                letter.style.filter = 'drop-shadow(0 0 0px rgba(255, 0, 0, 0))';
            });
            
            sideLines.forEach(line => {
                line.style.animation = 'none';
                line.style.opacity = '0';
                line.style.width = '0';
                line.style.borderTop = '3px solid transparent';
                line.style.borderBottom = '3px solid transparent';
                line.style.borderLeft = '3px solid transparent';
                line.style.borderRight = '3px solid transparent';
                line.style.boxShadow = '0 0 0px rgba(255, 0, 0, 0)';
            });
            
            setTimeout(() => {
                mainContainer.style.animation = 'zoomOut 4s ease-out forwards';
                mainContainer.style.animationPlayState = 'paused';
                
                number.style.animation = 'glowNumber 3s ease-out 4.2s forwards';
                number.style.animationPlayState = 'paused';
                
                bigLetters[0].style.animation = 'letterS 4s ease-out 0.3s forwards';
                bigLetters[0].style.animationPlayState = 'paused';
                
                bigLetters[1].style.animation = 'letterR 4s ease-out 0.5s forwards';
                bigLetters[1].style.animationPlayState = 'paused';
                
                animLetters.forEach((letter, index) => {
                    const delay = middleDelays[index % middleDelays.length];
                    letter.style.animation = `letterFromTop 4s ease-out ${delay}s forwards`;
                    letter.style.animationPlayState = 'paused';
                });
                
                thingsLetters.forEach((letter, index) => {
                    const delay = thingsDelays[index % thingsDelays.length];
                    letter.style.animation = `thingsFromBottom 4s ease-out ${delay}s forwards`;
                    letter.style.animationPlayState = 'paused';
                });
                
                sideLines.forEach(line => {
                    line.style.animation = 'expandSideLine 2s ease-out 4.5s forwards';
                    line.style.animationPlayState = 'paused';
                });
                
                mainContainer.style.opacity = '1';
                playIntroAnimation();
            }, 100);
        }

        function playIntroAnimation() {
            document.body.classList.add('animating');
            const container = document.getElementById('mainContainer');
            container.style.animationPlayState = 'running';

            const number = document.getElementById('numberDisplay');
            number.style.animationPlayState = 'running';

            const bigLetters = document.querySelectorAll('.big-letter');
            bigLetters.forEach(letter => {
                letter.style.animationPlayState = 'running';
            });

            const animLetters = document.querySelectorAll('.anim-letter');
            animLetters.forEach(letter => {
                letter.style.animationPlayState = 'running';
            });

            const thingsLetters = document.querySelectorAll('.things .letter');
            thingsLetters.forEach(letter => {
                letter.style.animationPlayState = 'running';
            });

            const sideLines = document.querySelectorAll('.side-line');
            sideLines.forEach(line => {
                line.style.animationPlayState = 'running';
            });

            setTimeout(() => {
                const clickText = document.getElementById('clickText');
                clickText.style.opacity = '1';
                clickText.style.pointerEvents = 'auto';
                clickText.classList.add('visible');
            }, 7000);
        }

        function showInputs() {
            const mainContainer = document.getElementById('mainContainer');
            const clickText = document.getElementById('clickText');

            mainContainer.style.opacity = '0';
            clickText.style.opacity = '0';
            clickText.style.pointerEvents = 'none';
            clickText.classList.remove('visible');

            setTimeout(() => {
                mainContainer.style.display = 'none';
                const controlsPanel = document.getElementById('controlsPanel');
                controlsPanel.style.opacity = '1';
                controlsPanel.style.pointerEvents = 'auto';
                controlsPanel.classList.add('slide-in');
            }, 500);
        }

        function resetToIntro() {
            const controlsPanel = document.getElementById('controlsPanel');
            controlsPanel.style.opacity = '0';
            controlsPanel.style.pointerEvents = 'none';
            controlsPanel.classList.remove('slide-in');

            document.getElementById('input1').value = '';
            document.getElementById('input2').value = '';
            document.getElementById('input3').value = '';

            setTimeout(() => {
                location.reload();
            }, 500);
        }

        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            input.addEventListener('input', function (e) {
                const turkishChars = {
                    'ı': 'i', 'İ': 'I',
                    'ş': 's', 'Ş': 'S',
                    'ğ': 'g', 'Ğ': 'G',
                    'ü': 'u', 'Ü': 'U',
                    'ö': 'o', 'Ö': 'O',
                    'ç': 'c', 'Ç': 'C'
                };

                let value = this.value;
                for (let [turkish, english] of Object.entries(turkishChars)) {
                    value = value.replace(new RegExp(turkish, 'g'), english);
                }
                this.value = value;
            });
        });

        function startAnimation() {
            const input1 = document.getElementById('input1').value.trim().toUpperCase();
            const input2 = document.getElementById('input2').value.trim().toUpperCase();
            const input3 = document.getElementById('input3').value.trim();

            if (!input1 || !input2 || !input3) {
                alert('Please fill all fields!');
                return;
            }

            const mainContainer = document.getElementById('mainContainer');
            mainContainer.style.opacity = '0';
            mainContainer.style.display = 'none';

            document.body.classList.remove('animating');

            setTimeout(() => {
                const firstLetter = document.getElementById('firstLetter');
                const middleLetters = document.getElementById('middleLetters');
                const lastLetter = document.getElementById('lastLetter');
                const thingsText = document.getElementById('thingsText');
                const numberDisplay = document.getElementById('numberDisplay');

                firstLetter.textContent = input1[0];
                lastLetter.textContent = input1[input1.length - 1];

                const middle = input1.slice(1, -1);
                let middleHTML = '';
                const delays = [0.8, 1.1, 0.5, 1.3, 0.9, 1.5];
                for (let i = 0; i < middle.length; i++) {
                    const delay = delays[i % delays.length];
                    middleHTML += `<span style="display: inline-block; opacity: 0; filter: drop-shadow(0 0 0px rgba(255, 0, 0, 0)); transform: translate(0, -250px); animation: letterFromTop 4s ease-out ${delay}s forwards; animation-play-state: paused;" class="anim-letter">${middle[i]}</span>`;
                }
                middleLetters.innerHTML = middleHTML;

                let thingsHTML = '';
                const thingsDelays = [0.7, 1, 0.4, 1.2, 0.9, 0.6];
                for (let i = 0; i < input2.length; i++) {
                    const delay = thingsDelays[i % thingsDelays.length];
                    thingsHTML += `<span class="letter" style="display: inline-block; opacity: 0; filter: drop-shadow(0 0 0px rgba(255, 0, 0, 0)); transform: translate(0px, 250px); animation: thingsFromBottom 4s ease-out ${delay}s forwards; animation-play-state: paused;">${input2[i]}</span>`;
                }
                thingsText.innerHTML = thingsHTML;

                numberDisplay.textContent = input3;

                document.getElementById('input1').value = '';
                document.getElementById('input2').value = '';
                document.getElementById('input3').value = '';

                mainContainer.style.display = 'flex';

                void mainContainer.offsetWidth;

                mainContainer.style.opacity = '1';

                setTimeout(() => {
                    document.body.classList.add('animating');

                    mainContainer.style.animationPlayState = 'running';
                    mainContainer.style.animation = 'none';
                    void mainContainer.offsetWidth;
                    mainContainer.style.animation = 'zoomOut 4s ease-out forwards';

                    numberDisplay.style.animationPlayState = 'running';
                    numberDisplay.style.animation = 'none';
                    void numberDisplay.offsetWidth;
                    numberDisplay.style.animation = 'glowNumber 3s ease-out 4.2s forwards';

                    const bigLetters = document.querySelectorAll('.big-letter');
                    bigLetters.forEach(letter => {
                        letter.style.animationPlayState = 'running';
                    });

                    const animLetters = document.querySelectorAll('.anim-letter');
                    animLetters.forEach(letter => {
                        letter.style.animationPlayState = 'running';
                    });

                    const thingsLetters = document.querySelectorAll('.things .letter');
                    thingsLetters.forEach(letter => {
                        letter.style.animationPlayState = 'running';
                    });

                    const sideLines = document.querySelectorAll('.side-line');
                    sideLines.forEach(line => {
                        line.style.animationPlayState = 'running';
                    });
                }, 50);
            }, 300);
        }