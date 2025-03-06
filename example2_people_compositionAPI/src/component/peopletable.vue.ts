
// in components use indirect access instead of importing the Vue module.
import * as _cva from "../_componentVueAccess.ts";

import { Header, Worker } from '../types.ts';

const template = `
    <div v-if="workers.length === 0">No workers available.</div>

    <div v-else>
        <input v-model="data.searchString" placeholder="search" class="mb-1">
        <table>
            <thead>
                <th v-for="header in headers" @click="setSortColumn(header.key)" :style="{ width: header.widthPx + 'px' }">
                    {{ header.value }}
                    <span class="arrow" :class="{ active: data.sortColumn === header.key && data.order === 'ASC' }">
                        &#8593;
                    </span>
                    <span class="arrow" :class="{ active: data.sortColumn === header.key && data.order === 'DESC' }">
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

interface ComponentProps {
	headers: Array<Header>,
	workers: Array<Worker>,
};

// "ComponentProps_keys" needs to list all property names (from ComponentProps) as an array-of-strings.
const ComponentProps_keys = [
	"headers",
	"workers",
];

function getInitialData(): ComponentData {
	return {
		sortColumn: "",
		order: "ASC",
		searchString: "",
	};
}

export default {

	template: template,

	props: ComponentProps_keys,

	setup( props: ComponentProps, context: _cva.SetupContext ) {
		const data: ComponentData = window.convertToVueReactive( getInitialData() ) as ComponentData;

		const filteredWorkers = window.convertToVueComputed( (): Array<Worker> => {

			const filteredWorkers = data.searchString === ""
				? props.workers
				: props.workers.filter(wo => Object.values(wo).join("").toLowerCase().indexOf(data.searchString.toLowerCase()) !== -1);

			const column: string = data.sortColumn;
			const order: string = data.order;

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
		} );

		const setSortColumn = ( column: string ): void => {
			if (data.sortColumn === column) {
				data.order = data.order === "ASC" ? "DESC" : "ASC";
			} else {
				data.order = "ASC";
				data.sortColumn = column;
			}
		};

		return { data, filteredWorkers, setSortColumn };
	},

};

