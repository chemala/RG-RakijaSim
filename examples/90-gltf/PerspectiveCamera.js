import { mat4 } from '../../lib/gl-matrix-module.js';

import { CamNode } from './CamNode.js';

export class PerspectiveCamera  {

    constructor(options = {}) {
        //super(options);
        this.node = options.node || null;
        this.matrix = options.matrix
            ? mat4.clone(options.matrix)
            : mat4.create();
        this.aspect = options.aspect || 1.5;
        this.fov = options.fov || 1.0;
        this.near = options.near || 0.01;
        this.far = options.far || Infinity;

        this.updateMatrix();
    }

    updateMatrix() {
        mat4.perspective(this.matrix,
            this.fov, this.aspect,
            this.near, this.far);
    }

}
