/*eslint-disable react-hooks/exhaustive-deps*/
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
// import OrbitControls from 'three-orbitcontrols';
import { connect } from 'react-redux';
import { TweenMax } from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
let loader, scene, renderer, clock, camera, container, earth;
/**
 * status:
 *  -1 - loading
 *  0  - not authenticated
 *  1  - authentcated
 */
export function Three({ isAuthenticated }) {
	const [status, setStatus] = useState(-1);
	const animate = () => {
		update();
		renderer.setClearColor(0xffffff, 0);
		requestAnimationFrame(() => {
			animate();
		});
		renderer.render(scene, camera);
	};
	const init = () => {
		container = document.getElementById('three-container');
		container.appendChild(renderer.domElement);

		//Setup Light
		let light = new THREE.HemisphereLight(0xffffff, 0xa3a3ff);
		light.position.set(0, 200, 0);
		scene.add(light);

		//Setup 3D Modal
		loader.load('./models/earth.glb', function (object3d) {
			earth = object3d.scene;
			earth.scale.multiplyScalar(10);
			scene.add(earth);
			animate();
			setStatus(0);
		});
	};
	useEffect(() => {
		loader = new GLTFLoader();
		scene = new THREE.Scene();
		renderer = new THREE.WebGLRenderer({ alpha: true });
		clock = new THREE.Clock();
		//Setup Camera
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
		camera.position.set(0, 0, 250);

		//Setup Control
		// controls = new OrbitControls(camera, renderer.domElement);
		// controls.enableDamping = true;
		// controls.dampingFactor = 0.25;
		// controls.enableZoom = false;

		renderer.setClearColor(0xffffff, 0);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		init();
		window.addEventListener('resize', onWindowResize, false);
		return () => {
			window.removeEventListener('resize', onWindowResize);
		};
	}, []);
	useEffect(() => {
		if (status !== -1) {
			if (isAuthenticated) setStatus(2);
			if (!isAuthenticated) setStatus(1);
			if (window.location.pathname === '/map') setStatus(2);
		}
		switch (status) {
			case 1:
				TweenMax.to(earth.position, 2, { y: 0 });
				break;
			case 2:
				TweenMax.to(earth.position, 2, { y: -120 });
				break;
			default:
				break;
		}
	}, [status, isAuthenticated]);

	const onWindowResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	};

	const update = () => {
		const dt = clock.getDelta();
		earth.rotation.x += dt * 0.2;
		earth.rotation.y += dt * 0.2;
		earth.rotation.z += dt * 0.2;
	};

	return <div id='three-container'></div>;
}
const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, null)(Three);
