
// instead of trying to directly import the Vue module in components,
// use shortcut functions through the global window object.

declare global {
	interface Window {
		convertToVueReactive( obj: object ): object;
		convertToVueComputed( x: any ): any;
	}
}

export interface SetupContext {
	attrs: any,
	slots: any,
	emit: any,
	expose: any,
}

