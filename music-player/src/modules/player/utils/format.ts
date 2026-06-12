export function parseName(fn: string): { artist: string, title: string } {
    var n = fn.replace(/\.(mp3|aac|flac|wav|ogg)$/i, '');
    if (n.includes(' - ')) {
        const p = n.split(' - ')
        return { artist: (p[0] ?? '').trim(), title: p.slice(1).join(' - ').trim() };
    }
    return { artist: '未知艺术家', title: n.trim() };
}
export function esc(s: string): string {
    return s ? s.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;') : '';
}
export function fmt(t: number):  string{
    if (isNaN(t)) return '00:00';
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

