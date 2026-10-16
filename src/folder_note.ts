import { Setting } from 'obsidian';

export const FOLDER_NOTE_DEFAULT_SETTINGS = {
    fileName: 'Index.md'
};

export class FolderNotePlugin {
    plugin: any;
    settings: typeof FOLDER_NOTE_DEFAULT_SETTINGS;

    constructor(plugin: any, settings: typeof FOLDER_NOTE_DEFAULT_SETTINGS) {
        this.plugin = plugin;
        this.settings = settings;

        this.plugin.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            let target: HTMLElement | null = evt.target as HTMLElement;
            if (target?.classList.contains('nav-folder-title-content') || target?.classList.contains('collapse-icon')) {
                target = target.parentElement
            }

            if (!target?.classList.contains('nav-folder-title')) {
                return
            }
            if (target?.parentElement?.classList.contains('is-collapsed')) {
                return
            }

            const pagePath = `${target?.getAttribute('data-path')}/${this.settings.fileName}`;
            if (this.plugin.app.vault.getAbstractFileByPath(pagePath)) {
                evt.preventDefault();
                this.plugin.app.workspace.openLinkText(pagePath, '');
            }
        });
    }

    displaySettings(containerEl: any) {
        new Setting(containerEl)
            .setName('Folder Note File Name')
            .addText(text => text.setValue(this.settings.fileName).onChange(async (value) => {
                this.settings.fileName = value;
                await this.plugin.saveSettings();
            }));
    }
}
