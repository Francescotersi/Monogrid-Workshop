import './style.css'
import { Inspector } from 'three/addons/inspector/Inspector.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { AmbientLight, Controls, DirectionalLight, EquirectangularReflectionMapping, Timer } from 'three/webgpu'

import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import * as THREE from 'three';
import { createEngine } from './setup'

// import sceneUrl from './assets/monkey.glb?url'
import sceneUrl from './assets/wizard_tower.glb?url'
import bakedTowerUrl from './assets/baked_tower.jpg?url'

import hdriUrl from './assets/zavelstein_4k.hdr?url'

async function main () {
  const container = document.getElementById('app')!
  const { scene, camera, renderer, controls} = await createEngine(container)
  const inspector = new Inspector()
  inspector.setRenderer(renderer)
  container.appendChild(inspector.domElement)

  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const hdrLoader = new HDRLoader()
  const envMap = await hdrLoader.loadAsync(hdriUrl)
  envMap.mapping = EquirectangularReflectionMapping
  scene.background = envMap
  scene.environment = envMap

  const directionalLight = new DirectionalLight() 
  const ambientLight = new AmbientLight(0x404040)
  scene.add(ambientLight)
  scene.add(directionalLight)
  
  const loader = new GLTFLoader()
  const gltf = await loader.loadAsync(sceneUrl)
  const model = gltf.scene
  scene.add(model)
  
  camera.position.set(10, 10, 10)
  camera.lookAt(0, 0, 0)
  
  const textureLoader = new THREE.TextureLoader();
  const lightMapTexture = await textureLoader.loadAsync(bakedTowerUrl);
  lightMapTexture.flipY = false; 
  lightMapTexture.colorSpace = THREE.SRGBColorSpace; 
  lightMapTexture.channel = 0;

  const tower = model.getObjectByName('Sketchfab_model');

  const cat_wizard = model.getObjectByName('Sketchfab_model.001');
  
  if (tower) {
    tower.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material && mesh.geometry) {
        
        // se l'oggetto non ha UV, lo saltiamo per evitare che diventi nero
        if (!mesh.geometry.hasAttribute('uv')) {
          console.warn(`Attenzione: l'oggetto ${mesh.name} non ha coordinate UV!`);
          return;
        }

        const oldMaterial = mesh.material as THREE.MeshStandardMaterial;    
        const hasVertexColors = mesh.geometry.hasAttribute('color');
        const useVertexColors = hasVertexColors ? oldMaterial.vertexColors : false;
        const baseColor = oldMaterial.color || new THREE.Color(0xffffff);

        mesh.material = new THREE.MeshBasicMaterial({
            map: oldMaterial.map,                       
            color: baseColor,                  
            vertexColors: useVertexColors,              
            lightMap: lightMapTexture,                  
            lightMapIntensity: 2.5
        });
      }
    });
  }
  
  const timer = new Timer()

  const animationLoop = () => {
    inspector.begin()

    timer.update()
    const delta = timer.getDelta()

    tower.rotation.z += 0.0 * delta   
    // cat_wizard.rotation.z += 0.0 * delta
 
    controls.update()

    renderer.render(scene, camera)
    inspector.finish()
  }

  renderer.setAnimationLoop(animationLoop)
}

main() 