var _ = require('lodash');

interface IVisualizerOptions {
    analyser: AnalyserNode;
}

export default class Visualizer {

    private options:IVisualizerOptions;

    private analyser:AnalyserNode;

    private bufferLength: number;

    private dataArray:Uint8Array;

    constructor(options:IVisualizerOptions) {
        this.options = options;
        this.analyser = this.options.analyser;
        this.bufferLength = this.analyser.frequencyBinCount;
        const minDecibels = -90;
        const maxDecibels = 6;

        this.analyser.minDecibels = minDecibels;
        this.analyser.maxDecibels = maxDecibels;
        this.dataArray = new Uint8Array(this.bufferLength);

    }

    visualize(element:THREE.Object3D) {

        this.analyser.getByteFrequencyData(this.dataArray);

        let average =_.reduce(this.dataArray, (value, seed)=> {
            return value + seed;
        }, 0) / this.dataArray.length;
        console.log(average);

        element.scale.set(average / 10, average / 10, average / 10);

        //for(var i = 0; i < this.bufferLength; i++) {
        //    //let amplitude = this.dataArray[i];
        //
        //    //if (amplitude >= minDecibels && amplitude <= maxDecibels) {
        //
        //        //let scaleOffset = 1 + Math.abs(amplitude);
        //        //element.scale.x = 1 + Math.abs(amplitude);
        //    //}
        //}
    }
}