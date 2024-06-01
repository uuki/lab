import * as THREE from 'three';
import { PARAMS } from '../../constants';

export default class ThreeRoom {
  constructor(scene) {
    this.scene = scene;
    this.config = {
      floorSize: PARAMS.WORLD_CAMERA.FAR * 0.6,
      wallThickness: 0.2,
      wallHeight: PARAMS.WORLD_CAMERA.FAR * 0.4,
    };

    this.geometries = {
      wall: new THREE.PlaneGeometry(this.config.floorSize, this.config.wallHeight),
    };

    this.models = {
      wall: {
        mesh: null,
        geometry: this.geometries.wall,
        material: null,
      },
      backWall: {
        mesh: null,
        geometry: this.geometries.wall,
        material: null,
      },
      floor: {
        mesh: null,
        geometry: new THREE.PlaneGeometry(this.config.floorSize, this.config.floorSize),
        material: null,
      },
    };
    this._initialize();
  }

  async _loadTexture(path) {
    const loader = new THREE.TextureLoader();
    return await loader.load(path);
  }

  async _initialize() {
    const floorTexture = await this._loadTexture('/webgl-school-2024/textures/floor.jpg');
    const wallTexture = await this._loadTexture('/webgl-school-2024/textures/wall.jpg');
    const wallBlueTexture = await this._loadTexture('/webgl-school-2024/textures/wall-blue.jpg');

    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 8);

    this.models.floor.material = new THREE.MeshPhongMaterial({
      map: floorTexture,
      side: THREE.DoubleSide,
    });
    this.models.wall.material = new THREE.MeshPhongMaterial({
      map: wallTexture,
      side: THREE.DoubleSide,
    });
    this.models.backWall.material = new THREE.MeshPhongMaterial({
      map: wallBlueTexture,
    });

    for (const modelName in this.models) {
      this.models[modelName].mesh = new THREE.Mesh(this.models[modelName].geometry, this.models[modelName].material);
    }

    // TODO 多重でインスタンス化している
    this.models.wall.mesh = [...Array(2)].map((_, i) => {
      const mesh = new THREE.Mesh(this.models.wall.geometry, this.models.wall.material);
      this.scene.add(mesh);
      return mesh;
    });

    this.models.backWall.mesh = new THREE.Mesh(this.models.backWall.geometry, this.models.backWall.material);
    this.scene.add(this.models.backWall.mesh);

    // Left wall
    this.models.wall.mesh[0].position.set(
      this.config.floorSize / 2 - this.config.wallThickness / 2,
      this.config.wallHeight / 2,
      0
    );
    this.models.wall.mesh[0].rotation.y = -Math.PI / 2;

    // Right wall
    this.models.wall.mesh[1].position.set(
      -this.config.floorSize / 2 + this.config.wallThickness / 2,
      this.config.wallHeight / 2,
      0
    );
    this.models.wall.mesh[1].rotation.y = Math.PI / 2;

    // Back wall
    this.models.backWall.mesh.position.set(
      0,
      this.config.wallHeight / 2,
      this.config.floorSize / -2 - this.config.wallThickness / -2
    );

    this.models.floor.mesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.models.floor.mesh);
  }
}
