

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.i7A_dWYe.js","_app/immutable/chunks/scheduler.Dvh3nbxH.js","_app/immutable/chunks/index.DLfFYia5.js"];
export const stylesheets = [];
export const fonts = [];
