import PubSub from 'pubsub-js';
import { TOPIC_IDS } from "../constants";

export default class Remote {
  constructor (selector) {
    this.el = document.querySelector(selector);
    this.controlTopics = {
      switch: TOPIC_IDS.THREE_REMOTE_SWITCH,
    }

    this._onClickButton = this._onClickButton.bind(this);
    this._initialize();
  }

  _initialize() {
    const buttons = [...this.el.querySelectorAll('[data-control-type]')];
    buttons.forEach((it) => {
      it.addEventListener('pointerdown', this._onClickButton);
    })
  }

  _onClickButton(e) {
    const type = e.currentTarget.dataset?.controlType;
    const topic = this.controlTopics[type];
    if (topic) {
      PubSub.publish(topic);
    }
  }
}
