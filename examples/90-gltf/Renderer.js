import { mat4 } from '../../lib/gl-matrix-module.js';
import { vec3 } from '../../lib/gl-matrix-module.js';
import { WebGL } from '../../common/engine/WebGL.js';

import { shaders } from './shaders.js';

// This class prepares all assets for use with WebGL
// and takes care of rendering.

export class Renderer {

    constructor(gl) {
        this.gl = gl;
        this.glObjects = new Map();
        this.programs = WebGL.buildPrograms(gl, shaders);
        //this.currentProgram = this.programs.perVertex;
        gl.clearColor(1, 1, 1, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        //gl.disable(gl.CULL_FACE);
    }

    prepareBufferView(bufferView) {
        if (this.glObjects.has(bufferView)) {
            return this.glObjects.get(bufferView);
        }

        const buffer = new DataView(
            bufferView.buffer,
            bufferView.byteOffset,
            bufferView.byteLength);
        const glBuffer = WebGL.createBuffer(this.gl, {
            target : bufferView.target,
            data   : buffer
        });
        this.glObjects.set(bufferView, glBuffer);
        return glBuffer;
    }

    prepareSampler(sampler) {
        if (this.glObjects.has(sampler)) {
            return this.glObjects.get(sampler);
        }

        const glSampler = WebGL.createSampler(this.gl, sampler);
        this.glObjects.set(sampler, glSampler);
        return glSampler;
    }

    prepareImage(image) {
        if (this.glObjects.has(image)) {
            return this.glObjects.get(image);
        }

        const glTexture = WebGL.createTexture(this.gl, { image });
        this.glObjects.set(image, glTexture);
        return glTexture;
    }

    prepareTexture(texture) {
        const gl = this.gl;

        this.prepareSampler(texture.sampler);
        const glTexture = this.prepareImage(texture.image);

        const mipmapModes = [
            gl.NEAREST_MIPMAP_NEAREST,
            gl.NEAREST_MIPMAP_LINEAR,
            gl.LINEAR_MIPMAP_NEAREST,
            gl.LINEAR_MIPMAP_LINEAR,
        ];

        if (!texture.hasMipmaps && mipmapModes.includes(texture.sampler.min)) {
            gl.bindTexture(gl.TEXTURE_2D, glTexture);
            gl.generateMipmap(gl.TEXTURE_2D);
            texture.hasMipmaps = true;
        }
    }

    prepareMaterial(material) {
        if (material.baseColorTexture) {
            this.prepareTexture(material.baseColorTexture);
        }
        if (material.metallicRoughnessTexture) {
            this.prepareTexture(material.metallicRoughnessTexture);
        }
        if (material.normalTexture) {
            this.prepareTexture(material.normalTexture);
        }
        if (material.occlusionTexture) {
            this.prepareTexture(material.occlusionTexture);
        }
        if (material.emissiveTexture) {
            this.prepareTexture(material.emissiveTexture);
        }
    }

    preparePrimitive(primitive) {
        if (this.glObjects.has(primitive)) {
            return this.glObjects.get(primitive);
        }

        this.prepareMaterial(primitive.material);

        const gl = this.gl;
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        if (primitive.indices) {
            const bufferView = primitive.indices.bufferView;
            bufferView.target = gl.ELEMENT_ARRAY_BUFFER;
            const buffer = this.prepareBufferView(bufferView);
            gl.bindBuffer(bufferView.target, buffer);
        }

        // this is an application-scoped convention, matching the shader
        const attributeNameToIndexMap = {
            POSITION   : 0,
            TEXCOORD_0 : 1,
        };

        for (const name in primitive.attributes) {
            const accessor = primitive.attributes[name];
            const bufferView = accessor.bufferView;
            const attributeIndex = attributeNameToIndexMap[name];

            if (attributeIndex !== undefined) {
                bufferView.target = gl.ARRAY_BUFFER;
                const buffer = this.prepareBufferView(bufferView);
                gl.bindBuffer(bufferView.target, buffer);
                gl.enableVertexAttribArray(attributeIndex);
                gl.vertexAttribPointer(
                    attributeIndex,
                    accessor.numComponents,
                    accessor.componentType,
                    accessor.normalized,
                    bufferView.byteStride,
                    accessor.byteOffset);
            }
        }

        this.glObjects.set(primitive, vao);
        return vao;
    }

    prepareMesh(mesh) {
        for (const primitive of mesh.primitives) {
            this.preparePrimitive(primitive);
        }
    }

    prepareNode(node) {
        if (node.mesh) {
            this.prepareMesh(node.mesh);
        }
        for (const child of node.children) {
            this.prepareNode(child);
        }
    }

    prepareScene(scene) {
        for (const node of scene.nodes) {
            this.prepareNode(node);
        }
    }

    getViewProjectionMatrix(camera) {
        const vpMatrix = mat4.clone(camera.matrix);
        let parent = camera.parent;
        while (parent) {
            mat4.mul(vpMatrix, parent.matrix, vpMatrix);
            parent = parent.parent;
        }
        mat4.invert(vpMatrix, vpMatrix);
        mat4.mul(vpMatrix, camera.camera.matrix, vpMatrix);
        return vpMatrix;
    }
    
    render(scene, camera) {
        const gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const program = this.programs.simple;
        gl.useProgram(program.program);
        gl.uniform1i(program.uniforms.uTexture, 0);

        const mvpMatrix = this.getViewProjectionMatrix(camera);
        for (const node of scene.nodes) {
            this.renderNode(node, mvpMatrix);
        }
    }

    renderY(scene, camera, light){
        const gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const program = this.programs.phong;
        gl.useProgram(program.program);
        gl.uniform1i(program.uniforms.uTexture, 0);

        let matrix = mat4.create();
        let matrixStack = [];

        const viewMatrix = camera.getGlobalTransform();
        mat4.invert(viewMatrix, viewMatrix);
        mat4.copy(matrix, viewMatrix);
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, camera.projection);

        gl.uniform1f(program.uniforms.uAmbient, light.ambient);

        gl.uniform3fv(program.uniforms.uLightPosition, light.position);
        let color = vec3.clone(light.color);
        vec3.scale(color, color, 1.0 / 255.0);
        gl.uniform3fv(program.uniforms.uLightColor,  color);
        gl.uniform3fv(program.uniforms.uLightAttenuation, light.attenuation);

        const mvpMatrix = this.getViewProjectionMatrix(camera);
        for (const node of scene.nodes) {
            this.renderNode(node, mvpMatrix);
        }
    }

    renderX(scene, camera, light) {
        const gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const program = this.programs.phong;
        gl.useProgram(program.program);

        const defaultTexture = this.defaultTexture;
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(program.uniforms.uTexture, 0);

        let matrix = mat4.create();
        let matrixStack = [];

        const viewMatrix = camera.getGlobalTransform();
        mat4.invert(viewMatrix, viewMatrix);
        mat4.copy(matrix, viewMatrix);
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, camera.projection);

        gl.uniform1f(program.uniforms.uAmbient, light.ambient);
        gl.uniform1f(program.uniforms.uDiffuse, light.diffuse);
        gl.uniform1f(program.uniforms.uSpecular, light.specular);
        gl.uniform1f(program.uniforms.uShininess, light.shininess);
        gl.uniform3fv(program.uniforms.uLightPosition, light.position);
        let color = vec3.clone(light.color);
        vec3.scale(color, color, 1.0 / 255.0);
        gl.uniform3fv(program.uniforms.uLightColor,  color);
        gl.uniform3fv(program.uniforms.uLightAttenuation, light.attenuation);

        scene.traverse(
            node => {
          
                matrixStack.push(mat4.clone(matrix));
                mat4.mul(matrix, matrix, node.matrix);
              
                if (node.model) {
                    gl.bindVertexArray(node.model.vao);
                    gl.uniformMatrix4fv(program.uniforms.uViewModel, false, matrix);
                    this.renderNode(node, this.getViewProjectionMatrix(camera))
                    //console.log(node.texture)
                    //const texture = node.texture || defaultTexture;
                    //gl.bindTexture(gl.TEXTURE_2D, texture);
                    //gl.drawElements(gl.TRIANGLES, node.model.indices, gl.UNSIGNED_SHORT, 0);
                }
            },
            node => {
                matrix = matrixStack.pop();
            }
        );
    }
    renderZ(scene, camera, light) {
        const gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const { program, uniforms } = this.programs.perVertex;
        gl.useProgram(program);

        const viewMatrix = camera.getGlobalTransform();
        mat4.invert(viewMatrix, viewMatrix);
        gl.uniformMatrix4fv(uniforms.uViewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(uniforms.uProjectionMatrix, false, camera.projection);
        gl.uniform3fv(uniforms.uCameraPosition,
            mat4.getTranslation(vec3.create(), camera.getGlobalTransform()));

        gl.uniform3fv(uniforms.uLight.color,
            vec3.scale(vec3.create(), light.color, light.intensity / 255));
        gl.uniform3fv(uniforms.uLight.position,
            mat4.getTranslation(vec3.create(), light.getGlobalTransform()));
        gl.uniform3fv(uniforms.uLight.attenuation, light.attenuation);
        const mvpMatrix =  this.getViewProjectionMatrix(camera);
        for (const node of scene.nodes) {
            this.renderNodeb(node, mvpMatrix);
        }
    }

    renderNodeb(node, modelMatrix) {
        const gl = this.gl;

        modelMatrix = mat4.clone(modelMatrix);
        mat4.mul(modelMatrix, modelMatrix, node.matrix);

        const { uniforms } = this.programs.perVertex;
        console.log()
        if (node.model && node.material) {
            gl.bindVertexArray(node.model.vao);

            gl.uniformMatrix4fv(uniforms.uModelMatrix, false, modelMatrix);

            gl.activeTexture(gl.TEXTURE0);
            gl.uniform1i(uniforms.uTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, node.material.texture);

            gl.uniform1f(uniforms.uMaterial.diffuse, node.material.diffuse);
            gl.uniform1f(uniforms.uMaterial.specular, node.material.specular);
            gl.uniform1f(uniforms.uMaterial.shininess, node.material.shininess);

            gl.drawElements(gl.TRIANGLES, node.model.indices, gl.UNSIGNED_SHORT, 0);
        }

        for (const child of node.children) {
            this.renderNode(child, modelMatrix);
        }
    }

    renderNode(node, mvpMatrix) {
        const gl = this.gl;
        //osvetljevanje 5 47min
        mvpMatrix = mat4.clone(mvpMatrix);
        mat4.mul(mvpMatrix, mvpMatrix, node.matrix);

        if (node.mesh) {
            const program = this.programs.simple;
            gl.uniformMatrix4fv(program.uniforms.uMvpMatrix, false, mvpMatrix);
            for (const primitive of node.mesh.primitives) {
                this.renderPrimitive(primitive);
            }
        }

        for (const child of node.children) {
            this.renderNode(child, mvpMatrix);
        }
    }

    renderPrimitive(primitive) {
        const gl = this.gl;

        const vao = this.glObjects.get(primitive);
        const material = primitive.material;
        const texture = material.baseColorTexture;
        const glTexture = this.glObjects.get(texture.image);
        const glSampler = this.glObjects.get(texture.sampler);

        gl.bindVertexArray(vao);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.bindSampler(0, glSampler);

        if (primitive.indices) {
            const mode = primitive.mode;
            const count = primitive.indices.count;
            const type = primitive.indices.componentType;
            gl.drawElements(mode, count, type, 0);
        } else {
            const mode = primitive.mode;
            const count = primitive.attributes.POSITION.count;
            gl.drawArrays(mode, 0, count);
        }
    }

}
