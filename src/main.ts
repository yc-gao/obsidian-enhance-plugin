import { Plugin } from 'obsidian';

import * as echarts from 'echarts';

export default class Main extends Plugin {
    echarts: typeof echarts;

    constructor(app: any, manifest: any) {
        super(app, manifest);
        this.echarts = echarts;
    }

    async onload() {
        console.log('Loading plugin: ' + this.manifest.name);

        this.registerMarkdownCodeBlockProcessor('runjs', async (source, el, ctx) => {
            eval(source)
        });
        this.registerMarkdownCodeBlockProcessor('echart', async (source, el, ctx) => {
            eval(`${source}
                el.style.width = '100%'
                el.style.aspectRatio = '16 / 9'

                setTimeout(() => {
                    const chart = this.echarts.init(el)
                    chart.setOption(option)
                })
                `
            )
        });
    }

    onunload() {
        console.log('Unloading plugin: ' + this.manifest.name);
    }
}
