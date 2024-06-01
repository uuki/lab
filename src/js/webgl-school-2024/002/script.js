import ThreeApp from './modules/Three';
import Remote from './modules/Remote';

class ReportPage {
  constructor() {
    new ThreeApp('#webgl');
    new Remote('.js-three-control');
  }
}

export default new ReportPage();
