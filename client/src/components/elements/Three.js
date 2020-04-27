import React, { useEffect } from "react";
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
const FBXLoader = require("three-fbxloader-offical");

const loader = new FBXLoader();
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
const clock = new THREE.Clock();
let container, earth;

//Setup Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  4000
);
camera.position.set(0, 0, 250);

//Setup Control
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;

renderer.setClearColor(0xffffff, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

export default function Three() {
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

  const animate = () => {
    update();
    renderer.setClearColor(0xffffff, 0);
    requestAnimationFrame(() => {
      animate();
    });
    renderer.render(scene, camera);
  };

  const init = () => {
    container = document.getElementById("three-container");
    container.appendChild(renderer.domElement);

    //Setup Light
    let light = new THREE.HemisphereLight(0xffffff, 0xa3a3ff);
    light.position.set(0, 200, 0);
    scene.add(light);

    //Setup 3D Modal
    loader.load("./models/earth.fbx", function(object3d) {
      earth = object3d;
      earth.scale.multiplyScalar(0.1);

      for (let mesh of earth.children[0].children) {
        const tLoader = new THREE.TextureLoader();
        tLoader.load(`./models/${mesh.name}_Diffuse.png`, texture => {
          mesh.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              // apply texture
              child.material.map = texture;
              child.material.needsUpdate = true;
            }
          });
        });
      }

      object3d.children[0].position.set(100, -700, 0);
      scene.add(object3d);
      animate();
    });
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    window.addEventListener("resize", onWindowResize, false);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <div id="three-container"></div>;
}
