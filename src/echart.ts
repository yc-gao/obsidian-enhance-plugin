import { Setting } from 'obsidian';

import * as echarts from 'echarts';

export const ECHARTS_DEFAULT_SETTINGS = {
    aspectRatio: '16 / 9',
    containLabel: true,
};

export class EChartsPlugin {
    plugin: any;
    settings: typeof ECHARTS_DEFAULT_SETTINGS;

    echarts: typeof echarts;

    constructor(plugin: any, settings: typeof ECHARTS_DEFAULT_SETTINGS) {
        this.plugin = plugin;
        this.settings = settings;

        this.echarts = echarts;
    }

    load() {
        this.plugin.registerMarkdownCodeBlockProcessor('echart', async (source: string) => {
            eval(`${source}
                el.style.width = '100%'
                el.style.aspectRatio = '${this.settings.aspectRatio}'

                setTimeout(() => {
                    const chart = this.echarts.init(el)
                    chart.setOption(Object.assign({
                        grid: {
                            containLabel: ${this.settings.containLabel},
                        }
                    }, option))
                })
                `
            )
        });
    }

    displaySettings(containerEl: any) {
        new Setting(containerEl)
            .setName('Echarts Aspect Ratio')
            .addText(text => text.setValue(this.settings.aspectRatio).onChange(async (value) => {
                this.settings.aspectRatio = value;
                await this.plugin.saveSettings();
            }));
    }
}
