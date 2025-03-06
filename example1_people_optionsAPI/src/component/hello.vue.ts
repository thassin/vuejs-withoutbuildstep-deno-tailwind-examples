
// in components use indirect access instead of importing the Vue module.
import * as _cva from "../_componentVueAccess.ts";

const template = `
    <h3 v-cloak>Greetings from {{from}}!</h3>
    <button @click="increment">current CLICK count = {{count}}</button>
`;

interface ComponentData {
	count: number,
};

interface ComponentMethods {
	increment(): void,
};

interface ComponentProps {
	from: string,
};

// "ComponentProps_keys" needs to list all property names (from ComponentProps) as an array-of-strings.
const ComponentProps_keys = [
	"from",
];

type ComponentContext = ComponentData & ComponentMethods & ComponentProps;

function getInitialData(): ComponentData {
	return {
		count: 0,
	};
}

export default {

	template: template,

	props: ComponentProps_keys,

	data(): ComponentData {
		return getInitialData();
	},

	methods: {
		increment(): void {
			// Vue sets "this" to always contain the Vue data context.
			const ctx: ComponentContext = this as unknown as ComponentContext;
			
			console.log( "hello-increment : from=" + ctx.from + " count=" + ctx.count );
			//console.log( this );

			ctx.count++;
		},
	},

};

