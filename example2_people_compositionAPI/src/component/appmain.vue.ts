
// in components use indirect access instead of importing the Vue module.
import * as VueAccess from "../_componentVueAccess.ts";

import { Header, Worker } from '../types.ts';

const template = `
    <PeopleTable v-bind:headers="data.headersArr" v-bind:workers="data.workersArr"></PeopleTable>
    <Hello from="AppMain" />
`;

interface ComponentData {
	headersArr: Array<Header>,
	workersArr: Array<Worker>,
}

interface ComponentMethods {
	getWorkers(): void,
};

type ComponentContext = ComponentData & ComponentMethods;

function getInitialData(): ComponentData {
	return {
		headersArr: [],
		workersArr: [],
	};
}

export default {

	template: template,

	setup() {
		const data: ComponentData = window.convertToVueReactive( getInitialData() ) as ComponentData;

		const getWorkers = (): void => {
			const workers = [
				{ name: "Airi Satou", position: "Accountant", office: "Tokyo", age: 33},
				{ name: "Angelica Ramos", position: "Chief Executive Officer (CEO)", office: "London", age: 47 },
				{ name: "Cedric Kelly", position: "Senior Javascript Developer", office: "Edinburgh", age: 22 },
				{ name: "Jennifer Chang", position: "Regional Director", office: "Singapore", age: 28 },
			];

			const headers = [
				{ key: "name", value: "Name", widthPx: 150 },
				{ key: "position", value: "Position", widthPx: 300 },
				{ key: "office", value: "Office", widthPx: 150 },
				{ key: "age", value: "Age", widthPx: 75 },
			];

			data.headersArr = headers;
			data.workersArr = workers;
		};

		return { data, getWorkers };
	},

	mounted() {
		// Vue sets "this" to always contain the Vue data context.
		const ctx: ComponentContext = this as unknown as ComponentContext;

		ctx.getWorkers();
	},

};

