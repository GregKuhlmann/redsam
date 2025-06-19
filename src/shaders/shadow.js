import * as Phaser from "phaser";

export default class ShadowPipeline extends Phaser.Renderer.WebGL.Pipelines
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
          gl_FragColor = vec4(0, 0, 0, min(color.a, 0.2));
        }
      `,
    });
  }
}
