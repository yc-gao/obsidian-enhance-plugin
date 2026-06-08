import { promisify } from 'node:util';
import * as child_process from 'node:child_process';

async function execCommand(command: string, opts: { cwd: string }): Promise<string> {
    const exec = promisify(child_process.exec);
    const { stdout } = await exec(command, opts);
    return stdout.trim();
}

export async function pullGit(path: string, rebase: boolean = false): Promise<void> {
    const command = rebase ? 'git pull --rebase' : 'git pull';
    await execCommand(command, { cwd: path });
}

export async function pushGit(path: string, force: boolean = false): Promise<void> {
    const command = force ? 'git push -f' : 'git push'
    await execCommand(command, { cwd: path });
}

export async function commitGit(path: string, pathSpec: string = '.', message: string = 'update'): Promise<void> {
    await execCommand(`git add ${pathSpec}`, { cwd: path });
    await execCommand(`git commit -m "${message}"`, { cwd: path });
}

export async function syncGit(path: string, pathSpec: string = '.', message: string = 'update'): Promise<void> {
    await commitGit(path, pathSpec, message)
    await pushGit(path)
}