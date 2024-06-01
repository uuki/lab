import PubSub from 'pubsub-js';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PARAMS, TOPIC_IDS } from "../../constants";

import ThreeRoom from './ThreeRoom';
import ThreeFan from './ThreeFan';

export default class ThreeApp {
  constructor(selector) {
    this.selector = selector;
    this.options = {
      axesBarLength: 5.0,
    };
    this.state = {
      power: true,
    };
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.circulatorModel = null;

    this.lastTime = 0;
    this.decreaseRate = 0.01;
    this.increaseRate = 0.01;
    this.currentDelta = 0;
    this.deltaLimit = {
      middle: 0.8,
      low: 0.8,
    }

    this._bind();
    window.addEventListener('DOMContentLoaded', this._initialize);
  }

  _bind() {
    this._initialize = this._initialize.bind(this);
    this._onResize = this._onResize.bind(this);
    this._render = this._render.bind(this);
    this._handleTogglePower = this._handleTogglePower.bind(this);
    PubSub.subscribe(TOPIC_IDS.THREE_REMOTE_SWITCH, this._handleTogglePower);
  }

  async _initialize() {
    const wrapper = document.querySelector(this.selector);

    // レンダラー
    const color = new THREE.Color(PARAMS.WORLD_RENDERER.CLEAR_COLOR);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(color);
    this.renderer.setSize(PARAMS.WORLD_RENDERER.WIDTH, PARAMS.WORLD_RENDERER.HEIGHT);
    wrapper.appendChild(this.renderer.domElement);

    // シーン
    this.scene = new THREE.Scene();

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      PARAMS.WORLD_CAMERA.FOVY,
      PARAMS.WORLD_CAMERA.ASPECT,
      PARAMS.WORLD_CAMERA.NEAR,
      PARAMS.WORLD_CAMERA.FAR,
    );
    this.camera.position.copy(PARAMS.WORLD_CAMERA.POSITION);
    this.camera.lookAt(PARAMS.WORLD_CAMERA.LOOK_AT);

    // ライト（点光源）
    this.pointLight = new THREE.PointLight(
      PARAMS.WORLD_LIGHT.COLOR,
      PARAMS.WORLD_LIGHT.INTENSITY
    );
    // ライト（スポットライト光源）
    this.spotLight = new THREE.SpotLight(
      PARAMS.WORLD_LIGHT.COLOR,
      10000,
    );

    // 光源のパラメータを調整
    this.pointLight.position.set(0, 60, 0);
    this.spotLight.position.set(0, 0, 100);
    this.spotLight.angle = Math.PI / 2;

    // カメラコントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // カメラの動きを滑らかにできる？
    // this.controls.enableDamping = true;
    // this.controls.dampingFactor = 0.25;

    // カメラのズーム範囲の制限
    this.controls.minDistance = PARAMS.WORLD_CAMERA.MIN_DISTANCE;
    this.controls.maxDistance = PARAMS.WORLD_CAMERA.MAX_DISTANCE;

    // チルト（上下の回転）範囲の制限
    this.controls.minPolarAngle = PARAMS.WORLD_CAMERA.MIN_POLAR_ANGLE;
    this.controls.maxPolarAngle = PARAMS.WORLD_CAMERA.MAX_POLAR_ANGLE;

    // 横回転（方位角）範囲の制限
    this.controls.minAzimuthAngle = PARAMS.WORLD_CAMERA.MIN_AZIMUTH_ANGLE;
    this.controls.maxAzimuthAngle = PARAMS.WORLD_CAMERA.MAX_AZIMUTH_ANGLE;

    // パンの有効・無効
    this.controls.enablePan = false;

    // // 軸ヘルパー
    // this.axesHelper = new THREE.AxesHelper(this.options.axesBarLength);
    // this.scene.add(this.axesHelper);

    // 光源をシーンに追加
    this.scene.add(this.pointLight);
    this.scene.add(this.spotLight);

    // モデルを初期化
    this.circulatorModel = new ThreeFan(this.scene);
    this.roomModel = new ThreeRoom(this.scene);

    window.addEventListener('resize', this._onResize);

    this._render();
  }

  _onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  _handleTogglePower() {
    this.state.power = !this.state.power;
  }

  _render(time = 0) {
    const deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;

    // 回転の制御
    if (this.state.power) {
      this.currentDelta += this.increaseRate * deltaTime;
      if (this.currentDelta > deltaTime) {
        this.currentDelta = deltaTime;
      }
    } else {
      this.currentDelta -= this.decreaseRate * deltaTime;
      if (this.currentDelta < 0) {
        this.currentDelta = 0;
      }
    }

    this.circulatorModel.animation(this.currentDelta);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this._render);
  }
}
