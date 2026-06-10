import { Plugin } from 'obsidian';

import * as echarts from 'echarts';

export class EChartsPlugin {
    plugin: Plugin;
    echarts: typeof echarts;

    constructor(plugin: Plugin) {
        this.plugin = plugin;
        this.echarts = echarts;
    }

    load() {
        this.plugin.registerMarkdownCodeBlockProcessor('echart', async (source) => {
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

    displaySettings() { }
}
