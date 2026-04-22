import { Color,
	PerspectiveCamera,
	Scene,
	WebGPURenderer, }
from 'three/webgpu'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface EngineContext {
	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGPURenderer;
  controls: OrbitControls;
}

export async function createEngine (container : HTMLElement): Promise<EngineContext> {
  const scene = new Scene()
  scene.background = new Color(0x1a1a2e)

  const aspect = container.clientWidth / container.clientHeight
  const camera = new PerspectiveCamera(75, aspect, 0.1, 1000)

  const renderer = new WebGPURenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  await renderer.init()

  window.addEventListener('resize', () => {
    const width = container.clientWidth
    const height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  })

  return { scene, camera, renderer, controls}
}