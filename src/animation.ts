import type { Group } from 'three/webgpu'

import { MathUtils, Object3D } from 'three/webgpu'

/**
 * Animazioni procedurali — Movimento degli oggetti nel parco.
 *
 * Invece di usare animazioni pre-registrate nel GLB (AnimationMixer),
 * qui calcoliamo le trasformazioni frame-per-frame con funzioni
 * trigonometriche. Questo approccio è perfetto per movimenti
 * ciclici semplici e non richiede dati aggiuntivi nel file 3D.
 *
 * I nomi degli oggetti ("Rock_1", "carousel", "horse") corrispondono
 * ai nomi assegnati in Blender ed esportati nel GLB.
 */

export interface SceneAnimations {
  model: Object3D
  catWizard: Object3D
  rockBaseY: number
}

export function createAnimations (model: Group): SceneAnimations {
  const rock = model.getObjectByName('Rock_1')
  const carousel = model.getObjectByName('carousel')
  const horse = model.getObjectByName('horse')

  if (!rock || !carousel || !horse) {
    const found = { rock: !!rock, carousel: !!carousel, horse: !!horse }
    console.warn('Nodi mancanti nel modello:', found)
  }

  return {
    rock: rock ?? model,
    carousel: carousel ?? new Object3D(),
    horse: horse ?? new Object3D(),
    rockBaseY: rock ? rock.position.y : 0,
  }
}

// Parametri delle animazioni — costanti per leggibilità
const ROCK_AMPLITUDE = 0.01
const ROCK_SPEED = 1.5
const CAROUSEL_SPEED = 0.1
const HORSE_MAX_RAD = MathUtils.degToRad(2)
const HORSE_SPEED = 2.0

/**
 * Aggiorna le trasformazioni di ogni oggetto animato.
 * - Rock_1: oscillazione verticale con sin(t)
 * - carousel: rotazione continua sull'asse Y
 * - horse: oscillazione angolare con sin(t)
 */
export function updateAnimations (anim: SceneAnimations, elapsed: number, delta: number): void {
  anim.rock.position.y =
    anim.rockBaseY + Math.sin(elapsed * ROCK_SPEED) * ROCK_AMPLITUDE

  anim.carousel.rotation.y += CAROUSEL_SPEED * delta

  anim.horse.rotation.z = Math.sin(elapsed * HORSE_SPEED) * HORSE_MAX_RAD
}
