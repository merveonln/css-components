// Three.js setup
let scene, camera, renderer;
let trees = [];
let lights = [];
let snowflakes = [];

// Audio setup
const audio = document.getElementById('audio');
const audioInput = document.getElementById('audioInput');
const playBtn = document.getElementById('playBtn');
const uploadBtn = document.getElementById('uploadBtn');
const titleElement = document.querySelector('.title');

let audioContext;
let analyser;
let dataArray;
let bufferLength;
let isPlaying = false;

// Initialize Three.js scene
function initThree() {
    const container = document.getElementById('container');
    
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 50);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 3, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // Create trees
    createThreeTrees();
    
    // Create snowflakes
    createSnowflakes();
    
    // Window resize
    window.addEventListener('resize', onWindowResize, false);
}

// Create Christmas trees
function createThreeTrees() {
    const treePositions = [
        { x: -6, z: -3, scale: 1.8 },
        { x: -3, z: -1, scale: 1.4 },
        { x: -1, z: 1, scale: 1.2 },
        { x: 0, z: 2, scale: 1.5 },
        { x: 1, z: 1, scale: 1.2 },
        { x: 3, z: -1, scale: 1.4 },
        { x: 6, z: -3, scale: 1.8 }
    ];
    
    treePositions.forEach(pos => {
        const tree = createTree(pos.x, pos.z, pos.scale);
        trees.push(tree);
        scene.add(tree.group);
    });
}

// Create single tree with lights
function createTree(posX, posZ, scale) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(posX, 0, posZ);
    
    // Tree geometry - cone shape
    const treeGeometry = new THREE.ConeGeometry(1.5 * scale, 5 * scale, 16, 32);
    const treeMaterial = new THREE.MeshPhongMaterial({
        color: 0x0d4d25,
        flatShading: false,
        shininess: 10,
        specular: 0x111111
    });
    const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
    treeMesh.position.y = 2.5 * scale;
    treeMesh.castShadow = true;
    treeGroup.add(treeMesh);
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3 * scale, 0.35 * scale, 0.8 * scale, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x4a2c1b });
    const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunkMesh.position.y = 0.4 * scale;
    treeGroup.add(trunkMesh);
    
    // Create lights on tree
    const treeLights = [];
    const lightCount = Math.floor(40 * scale);
    const colors = [0xff6600, 0xffaa00, 0xff0000, 0x00ffff, 0xff00ff, 0x00ff00, 0xffff00];
    
    for (let i = 0; i < lightCount; i++) {
        // Spiral pattern around cone
        const heightProgress = i / lightCount;
        const height = 0.5 * scale + heightProgress * 4.5 * scale;
        const radius = (1.5 * scale) * (1 - heightProgress * 0.85);
        const angle = heightProgress * Math.PI * 6 + (Math.random() - 0.5) * 0.5;
        
        const x = Math.cos(angle) * radius * (0.7 + Math.random() * 0.3);
        const y = height;
        const z = Math.sin(angle) * radius * (0.7 + Math.random() * 0.3);
        
        // Light sphere
        const lightGeometry = new THREE.SphereGeometry(0.12 * scale, 12, 12);
        const lightColor = colors[Math.floor(Math.random() * colors.length)];
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: lightColor,
            transparent: true,
            opacity: 0.7,
            emissive: lightColor,
            emissiveIntensity: 0.5
        });
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.position.set(x, y, z);
        
        // Store original data
        lightMesh.userData = {
            originalColor: lightColor,
            baseScale: scale,
            pulseOffset: Math.random() * Math.PI * 2,
            isActive: false
        };
        
        treeGroup.add(lightMesh);
        treeLights.push(lightMesh);
    }
    
    // Star on top
    const starGeometry = new THREE.SphereGeometry(0.25 * scale, 16, 16);
    const starMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.9,
        emissive: 0xffff00,
        emissiveIntensity: 0.8
    });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    starMesh.position.y = 5.2 * scale;
    starMesh.userData = {
        originalColor: 0xffff00,
        baseScale: scale,
        pulseOffset: 0,
        isActive: false,
        isStar: true
    };
    treeGroup.add(starMesh);
    treeLights.push(starMesh);
    
    lights.push(...treeLights);
    
    return { group: treeGroup, lights: treeLights };
}

// Create snowflakes
function createSnowflakes() {
    const snowGeometry = new THREE.BufferGeometry();
    const snowVertices = [];
    
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 50;
        const y = Math.random() * 30;
        const z = (Math.random() - 0.5) * 50;
        snowVertices.push(x, y, z);
    }
    
    snowGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(snowVertices, 3)
    );
    
    const snowMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });
    
    const snow = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snow);
    snowflakes.push(snow);
}

// Audio setup
function setupAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }
}

// Get audio data
function getAudioData() {
    if (!analyser) return { low: 0, mid: 0, high: 0, average: 0 };
    
    analyser.getByteFrequencyData(dataArray);
    
    // Split frequencies into ranges
    const third = Math.floor(bufferLength / 3);
    let low = 0, mid = 0, high = 0;
    
    for (let i = 0; i < third; i++) {
        low += dataArray[i];
    }
    for (let i = third; i < third * 2; i++) {
        mid += dataArray[i];
    }
    for (let i = third * 2; i < bufferLength; i++) {
        high += dataArray[i];
    }
    
    low = (low / third) / 255;
    mid = (mid / third) / 255;
    high = (high / third) / 255;
    const average = (low + mid + high) / 3;
    
    return { low, mid, high, average };
}

// Update lights based on audio
function updateLights(audioData) {
    const time = Date.now() * 0.001;
    
    lights.forEach((light, index) => {
        if (isPlaying && audioData.average > 0.05) {
            // Turn on lights
            if (!light.userData.isActive) {
                light.userData.isActive = true;
            }
            
            // Pulse with music
            const pulse = Math.sin(time * 3 + light.userData.pulseOffset) * 0.5 + 0.5;
            const musicPulse = light.userData.isStar ? audioData.high * 1.5 : 
                              (index % 3 === 0 ? audioData.low * 1.2 : 
                               index % 3 === 1 ? audioData.mid * 1.2 : audioData.high * 1.2);
            
            const intensity = 0.7 + pulse * 0.3 + musicPulse * 0.8;
            const scale = 1.2 + musicPulse * 1.5;
            
            light.material.color.setHex(light.userData.originalColor);
            light.material.opacity = Math.min(1, intensity);
            light.scale.setScalar(scale * light.userData.baseScale);
            
            // Add glow effect
            light.material.emissive = new THREE.Color(light.userData.originalColor);
            light.material.emissiveIntensity = Math.min(2, intensity * 1.5);
            
        } else {
            // Keep base glow when not playing
            const pulse = Math.sin(time * 2 + light.userData.pulseOffset) * 0.3 + 0.7;
            light.material.opacity = pulse * 0.8;
            light.material.emissiveIntensity = 0.5;
            light.scale.setScalar(light.userData.baseScale);
        }
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const audioData = getAudioData();
    
    // Update lights
    updateLights(audioData);
    
    // Update snowflakes
    snowflakes.forEach(snow => {
        const positions = snow.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.02;
            if (positions[i] < -5) {
                positions[i] = 25;
            }
        }
        snow.geometry.attributes.position.needsUpdate = true;
    });
    
    // Subtle camera movement
    if (isPlaying && audioData.average > 0.1) {
        camera.position.x = Math.sin(Date.now() * 0.0002) * 0.5;
        camera.position.y = 3 + Math.sin(Date.now() * 0.0003) * 0.3;
        camera.lookAt(0, 2, 0);
    }
    
    // Update title
    if (isPlaying && audioData.average > 0.1) {
        titleElement.classList.add('active');
    } else {
        titleElement.classList.remove('active');
    }
    
    renderer.render(scene, camera);
}

// Window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Upload audio file
uploadBtn.addEventListener('click', () => {
    audioInput.click();
});

audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        audio.src = url;
        playBtn.textContent = '▶ PLAY';
        isPlaying = false;
    }
});

// Play/Pause control
playBtn.addEventListener('click', () => {
    if (!audio.src) {
        alert('Lütfen önce bir müzik dosyası yükleyin!');
        return;
    }

    if (!audioContext) {
        setupAudio();
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶ PLAY';
    } else {
        audio.play();
        playBtn.textContent = '⏸ PAUSE';
    }
    isPlaying = !isPlaying;
});

// Initialize
initThree();
animate();
