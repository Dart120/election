export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","smui-dark.css","smui.css"]),
	mimeTypes: {".png":"image/png",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.Bjjlz-fr.js","app":"_app/immutable/entry/app.Bagh-YCY.js","imports":["_app/immutable/entry/start.Bjjlz-fr.js","_app/immutable/chunks/entry.Dh8zKmpF.js","_app/immutable/chunks/scheduler.Dvh3nbxH.js","_app/immutable/chunks/index.CUFGGIGi.js","_app/immutable/entry/app.Bagh-YCY.js","_app/immutable/chunks/scheduler.Dvh3nbxH.js","_app/immutable/chunks/index.DLfFYia5.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
