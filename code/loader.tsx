import * as $ from 'jquery'

export default class AudioLoader {

  private request:any;

  constructor() {
    this.request = new XMLHttpRequest();
    this.request.responseType = 'arraybuffer';
  }

  getRequest():XMLHttpRequest {
    return this.request;
  }

  load(filename:string):void {
    this.request.open('GET', "../audio/" + filename, true);
    this.request.send();
  }
}
