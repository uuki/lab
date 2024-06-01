import { Vector3 } from 'three';

export const PARAMS = {
  COLORS: {
    BLUE: 0x52abb3,
    BLUE_DARK: 0x275459,
    GREEN: 0x81f0b5,
  },
  WORLD_CAMERA: {
    FOVY: 45,
    ASPECT: window.innerWidth / window.innerHeight,
    NEAR: 0.1,
    FAR: 100.0,
    POSITION: new Vector3(6, 20, 60),
    LOOK_AT: new Vector3(0.0, 0.0, 0.0),
    MIN_DISTANCE: 20,
    MAX_DISTANCE: 30,
    MIN_POLAR_ANGLE: Math.PI / 4,
    MAX_POLAR_ANGLE: Math.PI / 2.2,
    MIN_AZIMUTH_ANGLE: -Math.PI / 2.6, // left
    MAX_AZIMUTH_ANGLE: Math.PI / 2.6, // right
  },
  WORLD_RENDERER: {
    CLEAR_COLOR: 0x666666,
    WIDTH: window.innerWidth,
    HEIGHT: window.innerHeight,
  },
  WORLD_LIGHT: {
    COLOR: 0xfcf9f5,
    INTENSITY: 16000, // 光の強度
    POSITION: new Vector3(0, 100, 0),
  }
}

export const TOPIC_IDS = {
  THREE_REMOTE_SWITCH: 'Three.remoteSwitch',
};
