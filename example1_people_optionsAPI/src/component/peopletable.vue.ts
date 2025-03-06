
// in components use indirect access instead of importing the Vue module.
import * as _cva from "../_componentVueAccess.ts";

import { Header, Worker } from '../types.ts';

const template = `
    <div v-if="workers.length === 0">No workers available.</div>

    <div v-else>
        <input v-model="searchString" placeholder="search" class="mb-1">
        <table>
            <thead>
                <th v-for="header in headers" @click="setSortColumn(header.key)" :style="{ width: header.widthPx + 'px' }">
                    {{ header.value }}
                    <span class="arrow" :class="{ active: this.sortColumn === header.key && this.order === 'ASC' }">
                        &#8593;
                    </span>
                    <span class="arrow" :class="{ active: this.sortColumn === header.key && this.order === 'DESC' }">
                        &#8595;
                    </span>
                </th>
            </thead>
            <tbody>
                <tr v-for="worker in filteredWorkers">
                    <td>{{worker.name}}</td>
                    <td>{{worker.position}}</td>
                    <td>{{worker.office}}</td>
                    <td>{{worker.age}}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <Hello from="PeopleTable" />
`;

interface ComponentData {
	sortColumn: string,
	order: string,
	searchString: string,
};

interface ComponentMethods {
	filteredWorkers(): Array<Worker>,	// computed
	setSortColumn(column: string): void,
};

interface ComponentProps {
	headers: Array<Header>,
	workers: Array<Worker>,
};

// "ComponentProps_keys" needs to list all property names (from ComponentProps) as an array-of-strings.
const ComponentProps_keys = [
	"headers",
	"workers",
];

type ComponentContext = ComponentData & ComponentMethods & ComponentProps;

function getInitialData(): ComponentData {
	return {
		sortColumn: "",
		order: "ASC",
		searchString: "",
	};
}

export default {

	template: template,

	data(): ComponentData {
		return getInitialData();
	},

	props: ComponentProps_keys,

	computed: {
		filteredWorkers(): Array<Worker> {
			// Vue sets "this" to always contain the Vue data context.
			const ctx: ComponentContext = this as unknown as ComponentContext;

			const filteredWorkers = ctx.searchString === ""
				? ctx.workers
				: ctx.workers.filter(wo => Object.values(wo).join("").toLowerCase().indexOf(ctx.searchString.toLowerCase()) !== -1);

			const column: string = ctx.sortColumn;
			const order: string = ctx.order;

			filteredWorkers.sort( function( a, b ) {
				// @ts-ignore :: TODO verify that "column" is one of the "Worker" keys.
				var nameA = a[column]+"".toUpperCase();

				// @ts-ignore :: TODO verify that "column" is one of the "Worker" keys.
				var nameB = b[column]+"".toUpperCase();

				if (order === "DESC" && nameA > nameB) {
					return -1;
				}
				if (order === "DESC" && nameA < nameB) {
					return 1;
				}
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			} );

			return filteredWorkers;
		},
	},

	methods: {
		setSortColumn( column: string ): void {
			// Vue sets "this" to always contain the Vue data context.
			const ctx: ComponentContext = this as unknown as ComponentContext;

			if (ctx.sortColumn === column) {
				ctx.order = ctx.order === "ASC" ? "DESC" : "ASC";
			} else {
				ctx.order = "ASC";
				ctx.sortColumn = column;
			}
		},
	},

};

