import * as Phaser from "phaser";

export default class DullPipeline extends Phaser.Renderer.WebGL.Pipelines
  .SinglePipeline {
  constructor(game) {
    super({
      game,
      fragShader: `
        precision mediump float;
        uniform sampler2D uMainSampler;
        varying vec2 outTexCoord;

        void main() {
          vec4 color = texture2D(uMainSampler, outTexCoord);
          float gray = (color.r + color.g + color.b) / 6.0;
          gl_FragColor = vec4(vec3(gray), color.a);
        }
      `,
    });
  }
}
