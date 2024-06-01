import * as THREE from 'three';
import { PARAMS } from '../../constants';

export default class ThreeFan {
  constructor(scene) {
    this.scene = scene;
    this.config = {
      bladeCount: 4,
      latticeCount: 52,
      radius: 0.4,
      rotationSpeed: Math.PI * 8,
      headRotationSpeedY: Math.PI / 8,
      headRotationSpeedX: Math.PI / 16,
      headRotationRangeX: Math.PI / 2,
      headRotationRangeY: Math.PI / 4,
      headRotationX: 0,
      headRotationDirectionY: 1,
      headRotationDirectionX: 1,
      headRotationAngleX: 0,
      isIncreasing: true,
      latchePoints: [...Array(10)].map((_, i) => new THREE.Vector2(Math.sin(i * 0.2) * 2 + 2, (i - 3) * 0.2)),
      baseSize: 1.6,
    };

    this.geometries = {};

    this.materials = {
      phongBlue: new THREE.MeshPhongMaterial({ color: PARAMS.COLORS.BLUE }),
      phongWhite: new THREE.MeshPhongMaterial({ color: 0xffffff }),
      phongWhiteDouble: new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
      phongDarkBlue: new THREE.MeshPhongMaterial({ color: PARAMS.COLORS.BLUE_DARK }),
    };

    this.models = {
      stand: {
        mesh: null,
        geometry: new THREE.CylinderGeometry(1.6, 1.6, 0.4, 30, 14),
        material: this.materials.phongBlue,
      },
      fakeButton: {
        mesh: null,
        geometry: new THREE.BoxGeometry(0.6, 0.36, 0.6),
        material: this.materials.phongWhite,
      },
      head: {
        mesh: null,
        geometry: new THREE.CylinderGeometry(
          this.config.baseSize,
          this.config.baseSize,
          this.config.baseSize * 0.4,
          32,
          1,
          true
        ),
        material: new THREE.MeshPhongMaterial({
          color: PARAMS.COLORS.BLUE,
          side: THREE.DoubleSide,
        }),
      },
      backEdge: {
        mesh: null,
        geometry: new THREE.TorusGeometry(
          this.config.baseSize,
          0.02,
          this.config.baseSize * 4,
          100,
          this.config.baseSize * 4
        ),
        material: this.materials.phongDarkBlue,
      },
      frontEdge: {
        mesh: null,
        geometry: new THREE.TorusGeometry(
          this.config.baseSize,
          0.02,
          this.config.baseSize * 4,
          100,
          this.config.baseSize * 4
        ),
        material: this.materials.phongDarkBlue,
      },
      lattice: {
        mesh: null,
        geometry: new THREE.BoxGeometry(0.028, 0.01, this.config.baseSize * 2),
        material: this.materials.phongWhite,
      },
      neck: {
        mesh: null,
        geometry: new THREE.CapsuleGeometry(this.config.baseSize * 0.3, this.config.baseSize * 0.3, 10, 20),
        material: this.materials.phongWhiteDouble,
      },
      foot: {
        mesh: null,
        geometry: new THREE.CylinderGeometry(this.config.baseSize * 0.1, this.config.baseSize * 0.1, 4, 20),
        material: this.materials.phongWhiteDouble,
      },
      bladeBase: {
        mesh: null,
        geometry: new THREE.CylinderGeometry(
          this.config.baseSize * 0.18,
          this.config.baseSize * 0.032,
          this.config.baseSize * 0.18,
          this.config.baseSize * 12.5
        ),
        material: new THREE.MeshPhongMaterial({ color: 0xededed }),
      },
      blade: {
        mesh: null,
        geometry: new THREE.CylinderGeometry(
          this.config.baseSize,
          this.config.baseSize * 0.874,
          0.1,
          1,
          1,
          false,
          -0.3,
          0.6
        ),
        material: new THREE.MeshPhongMaterial({
          color: PARAMS.COLORS.BLUE,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        }),
      },
    };
    this.groups = {
      head: null,
      neck: null,
      blade: null,
      frontLattice: null,
      backLattice: null,
      stand: null,
    };

    this._initialize();
  }

  _initialize() {
    for (const modelName in this.models) {
      this.models[modelName].mesh = new THREE.Mesh(this.models[modelName].geometry, this.models[modelName].material);
    }

    for (const groupName in this.groups) {
      this.groups[groupName] = new THREE.Group();
    }

    // 足の位置
    this.models.foot.mesh.position.x = -2;
    this.models.foot.mesh.position.y = 2.2;
    this.models.foot.mesh.position.z = 8 - 0.94;

    // スタンドの位置
    this.groups.stand.position.x = -2;
    this.groups.stand.position.z = 8 - 0.94;

    // アタマのメッシュを水平に
    this.models.head.mesh.rotation.x = Math.PI / 2;

    // 支柱を水平に
    this.models.bladeBase.mesh.rotation.x = Math.PI / 2;

    // フチの位置
    this.models.frontEdge.mesh.position.z = 0.3;
    this.models.backEdge.mesh.position.z = -0.3;

    // 格子グループの位置
    this.groups.frontLattice.position.z = 0.3;
    this.groups.backLattice.position.z = -0.3;

    // 首グループの位置
    this.groups.neck.position.x = -2;
    this.groups.neck.position.y = 4.2;
    this.groups.neck.position.z = 6.8;

    // 首にアタマを追加
    this.groups.neck.add(this.models.neck.mesh);
    this.groups.neck.add(this.groups.head);

    // 首の位置
    this.models.neck.mesh.rotation.x = Math.PI / 2;
    this.models.neck.mesh.position.z = 0.42;

    // フェイクボタンの移動
    this.models.fakeButton.mesh.rotation.x = Math.PI / 2;
    this.models.fakeButton.mesh.position.z = 1;

    this.groups.stand.add(this.models.stand.mesh);
    this.groups.stand.add(this.models.fakeButton.mesh);

    this.groups.head.position.z = 1.2;

    // アタマグループに、フレーム、羽グループ、支柱、格子グループ、フチを追加
    this.groups.head.add(this.models.head.mesh);
    this.groups.head.add(this.groups.blade);
    this.groups.head.add(this.models.bladeBase.mesh);
    this.groups.head.add(this.groups.frontLattice);
    this.groups.head.add(this.groups.backLattice);
    this.groups.head.add(this.models.frontEdge.mesh);
    this.groups.head.add(this.models.backEdge.mesh);

    // 首をシーンに追加
    this.scene.add(this.groups.neck);

    // 足とスタンドをシーンに追加
    this.scene.add(this.models.foot.mesh);
    this.scene.add(this.groups.stand);

    // 格子
    this.models.lattice.mesh = [...Array(this.config.latticeCount)].map((_, i) => {
      const mesh = new THREE.Mesh(this.models.lattice.geometry, this.models.lattice.material);
      // 羽根をデフォルト位置から垂直に回転
      mesh.rotation.x = Math.PI / 2;
      // 羽根を放射状に配置
      const angle = (i / this.config.latticeCount) * Math.PI * 2;
      // 中心から外向きに回転
      mesh.rotation.y = -angle;

      this.groups.frontLattice.add(mesh);
      this.groups.backLattice.add(mesh.clone());
      return mesh;
    });

    // 羽の配置
    this.models.blade.mesh = [...Array(this.config.bladeCount)].map((_, i) => {
      const mesh = new THREE.Mesh(this.models.blade.geometry, this.models.blade.material);

      mesh.rotation.x = Math.PI / 2;
      const angle = (i / this.config.bladeCount) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6);
      mesh.rotation.y = -angle;

      this.groups.blade.add(mesh);
      return mesh;
    });

    // 2枚目と4枚目の羽根のz軸位置を1枚目と3枚目に合わせる
    this.models.blade.mesh[1].position.z = this.models.blade.mesh[0].position.z;
    this.models.blade.mesh[3].position.z = this.models.blade.mesh[2].position.z;

    // 1枚目と3枚目の羽根のx軸位置を2枚目と4枚目に合わせる
    this.models.blade.mesh[0].position.x =
      (this.models.blade.mesh[1].position.x + this.models.blade.mesh[3].position.x) / 2;
    this.models.blade.mesh[2].position.x =
      (this.models.blade.mesh[1].position.x + this.models.blade.mesh[3].position.x) / 2;
  }

  animation(delta) {
    // 羽グループの回転
    this.groups.blade.rotation.z -= this.config.rotationSpeed * delta;

    // アタマの回転
    this.config.headRotationX += this.config.headRotationSpeedX * delta * this.config.headRotationDirectionX;
    if (this.config.headRotationX >= this.config.headRotationRangeX) {
      this.config.headRotationDirectionX = -1;
      this.config.headRotationX = this.config.headRotationRangeX;
    } else if (this.config.headRotationX <= 0) {
      this.config.headRotationDirectionX = 1;
      this.config.headRotationX = 0;
    }
    this.groups.neck.rotation.y = (this.config.headRotationX - this.config.headRotationRangeX / 2) * -1;
  }
}
