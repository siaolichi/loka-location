import React, { useEffect, useState } from "react";
import * as THREE from "three";
const FBXLoader = require("three-fbxloader-offical");

const loader = new FBXLoader();
const scene = new THREE.Scene();
const clock = new THREE.Clock();
let light = new THREE.HemisphereLight(0xffffff, 0xa3a3ff);
// let light = new THREE.AmbientLight(0xffffff);
light.position.set(0, 200, 0);
scene.add(light);

light = new THREE.AmbientLight(0x606060);
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  4000
);
camera.position.set(0, 0, 250);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0xffffff, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
let container, earth;

export default function Three() {
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  const animate = () => {
    const dt = clock.getDelta();
    earth.rotation.x += dt * 0.2;
    earth.rotation.y += dt * 0.2;
    earth.rotation.z += dt * 0.2;
    renderer.setClearColor(0xffffff, 0);
    requestAnimationFrame(() => {
      animate();
    });

    renderer.render(scene, camera);
  };
  useEffect(() => {
    window.addEventListener("resize", onWindowResize, false);
    container = document.getElementById("three-container");
    container.appendChild(renderer.domElement);
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
      //   earth.traverse(function(child) {
      //     if (child instanceof THREE.Mesh) {
      //       // apply texture
      //       console.log(child.name);
      //       //   child.material.map = texture;
      //       child.material.needsUpdate = true;
      //     }
      //   });
      object3d.children[0].position.set(100, -700, 0);
      scene.add(object3d);
      animate();
    });
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);
  return <div id="three-container"></div>;
}
