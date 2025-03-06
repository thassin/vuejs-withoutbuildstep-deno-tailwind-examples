
// in components use indirect access instead of importing the Vue module.
import * as _cva from "../_componentVueAccess.ts";

const template = `
    <h3 v-cloak>Greetings from {{from}}!</h3>
    <button @click="increment">current CLICK count = {{data.count}}</button>
`;

interface ComponentData {
	count: number,
};

interface ComponentProps {
	from: string,
};

// "ComponentProps_keys" needs to list all property names (from ComponentProps) as an array-of-strings.
const ComponentProps_keys = [
	"from",
];

function getInitialData(): ComponentData {
	return {
		count: 0,
	};
}

export default {

	template: template,

	props: ComponentProps_keys,

	setup( props: ComponentProps, context: _cva.SetupContext ) {
		const data: ComponentData = window.convertToVueReactive( getInitialData() ) as ComponentData;

		const increment = (): void => {
			console.log( "hello-increment : from=" + props.from + " count=" + data.count );
			data.count++;
		};

		return { data, increment };
	},

};

