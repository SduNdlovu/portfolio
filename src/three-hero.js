const stage = document.querySelector('.project-stage');
const canvas = stage?.querySelector('.three-canvas');

if (stage && canvas && 'IntersectionObserver' in window) {
  const loadObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0]?.isIntersecting) return;
    observer.disconnect();
    import('three').then(THREE => {
      try {
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setClearColor(0x183f5e, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(48, 1, .1, 30);
        camera.position.z = 8;
        const assembly = new THREE.Group();
        scene.add(assembly);
        const resources = [];

        // Three offset projection planes form a spatial frame for the selected app.
        const specs = [
          { width: 5.6, height: 3.35, z: -1.8, x: 1.25, y: .3, color: 0x5db9ed },
          { width: 4.9, height: 3.0, z: -2.8, x: -1.4, y: -.45, color: 0x9ad9f5 },
          { width: 6.1, height: 3.7, z: -3.7, x: .2, y: .1, color: 0x347aa7 }
        ];
        const frames = specs.map(spec => {
          const box = new THREE.BoxGeometry(spec.width, spec.height, .04);
          const geometry = new THREE.EdgesGeometry(box);
          box.dispose();
          const material = new THREE.LineBasicMaterial({ color: spec.color, transparent: true, opacity: .6 });
          const frame = new THREE.LineSegments(geometry, material);
          frame.position.set(spec.x, spec.y, spec.z);
          frame.rotation.y = -.12;
          assembly.add(frame);
          resources.push(geometry, material);
          return frame;
        });

        const positions = [];
        for (let index = 0; index < 80; index++) {
          const x = Math.sin(index * 13.37) * 4.2;
          const y = Math.cos(index * 7.91) * 2.6;
          const z = -1.5 - (index % 7) * .45;
          positions.push(x, y, z);
        }
        const dotsGeometry = new THREE.BufferGeometry();
        dotsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const dotsMaterial = new THREE.PointsMaterial({ color: 0xd2f1ff, size: .035, transparent: true, opacity: .72 });
        const dots = new THREE.Points(dotsGeometry, dotsMaterial);
        assembly.add(dots);
        resources.push(dotsGeometry, dotsMaterial);

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        let reduced = motionQuery.matches;
        let visible = true;
        let contextLost = false;
        let pointerX = 0;
        let pointerY = 0;
        let previousTime = 0;

        const renderStill = () => { if (!contextLost) renderer.render(scene, camera); };
        const resize = () => {
          const width = Math.max(1, stage.clientWidth);
          const height = Math.max(1, stage.clientHeight);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          renderStill();
        };
        const frame = time => {
          const delta = Math.min((time - previousTime) / 1000 || 0, .05);
          previousTime = time;
          assembly.rotation.y += (pointerX * .11 - assembly.rotation.y) * Math.min(delta * 4, 1);
          assembly.rotation.x += (pointerY * .07 - assembly.rotation.x) * Math.min(delta * 4, 1);
          frames.forEach((item, index) => { item.position.y += Math.sin(time * .0005 + index * 2) * .0007; });
          renderer.render(scene, camera);
        };
        const updateLoop = () => {
          if (contextLost) return;
          previousTime = 0;
          renderer.setAnimationLoop(visible && !document.hidden && !reduced ? frame : null);
          if (reduced || !visible) renderStill();
        };
        const onPointerMove = event => {
          if (reduced || event.pointerType === 'touch') return;
          const rect = stage.getBoundingClientRect();
          pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2;
          pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2;
        };
        const onPointerLeave = () => { pointerX = 0; pointerY = 0; };
        const onMotionChange = () => { reduced = motionQuery.matches; updateLoop(); };
        const onProjectChange = event => {
          const colors = [0x5db9ed, 0x48a9d4, 0x86d8f4];
          frames[0].material.color.setHex(colors[event.detail.index]);
          renderStill();
        };
        const onContextLost = event => { event.preventDefault(); contextLost = true; renderer.setAnimationLoop(null); stage.classList.remove('has-webgl'); };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(stage);
        const visibilityObserver = new IntersectionObserver(entries => {
          visible = entries[0]?.isIntersecting ?? false;
          updateLoop();
        }, { threshold: .05 });
        visibilityObserver.observe(stage);
        stage.addEventListener('pointermove', onPointerMove);
        stage.addEventListener('pointerleave', onPointerLeave);
        motionQuery.addEventListener('change', onMotionChange);
        window.addEventListener('portfolio:project-change', onProjectChange);
        document.addEventListener('visibilitychange', updateLoop);
        canvas.addEventListener('webglcontextlost', onContextLost);

        resize();
        stage.classList.add('has-webgl');
        updateLoop();

        window.addEventListener('pagehide', () => {
          renderer.setAnimationLoop(null);
          resizeObserver.disconnect();
          visibilityObserver.disconnect();
          stage.removeEventListener('pointermove', onPointerMove);
          stage.removeEventListener('pointerleave', onPointerLeave);
          motionQuery.removeEventListener('change', onMotionChange);
          window.removeEventListener('portfolio:project-change', onProjectChange);
          document.removeEventListener('visibilitychange', updateLoop);
          canvas.removeEventListener('webglcontextlost', onContextLost);
          resources.forEach(resource => resource.dispose());
          renderer.dispose();
        }, { once: true });
      } catch (error) {
        console.warn('Three.js stage could not start; keeping the static project screen.', error);
      }
    }).catch(error => console.warn('Three.js module could not load; keeping the static project screen.', error));
  }, { rootMargin: '120px' });
  loadObserver.observe(stage);
}
