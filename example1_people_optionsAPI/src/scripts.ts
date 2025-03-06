
import * as Vue from "my_vue_import_symbol";

//import { Header, Worker } from './types.ts';

console.log( "init componentVueAccess" );
import * as VueAccess from "./_componentVueAccess.ts";
window.convertToVueReactive = ( obj ) => Vue.reactive( obj );

// check the mount point:
const el = document.getElementById( 'app' );
console.log( "check the mount point:" );
console.log( el );

// now create and launch the app root component.

import { getComponent } from './_componentData.ts';
import toplevelComponent from "./component/appmain.vue.ts";

const app = Vue.createApp( toplevelComponent );

// https://vuejs.org/guide/components/registration
app.component( "PeopleTable", Vue.defineAsyncComponent( () => import( getComponent( "peopletable" ) ) ) );
app.component( "Hello", Vue.defineAsyncComponent( () => import( getComponent( "hello" ) ) ) );

app.mount('#app');

