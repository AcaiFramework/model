// interfaces
import ModelTypeInterface from "../interfaces/modelType";

// Types
import stringType 	from "./string/index";
import intType 		from "./int";
import dateType 	from "./date";
import booleanType 	from "./boolean";
import floatType 	from "./float";
import hashType 	from "./hash";

let typesList: Record<string, ModelTypeInterface> = {
	"string"	: stringType,
	"int"		: intType,
	"float"		: floatType,
	"date"		: dateType,
	"boolean"	: booleanType,
	"hash"		: hashType,
};

// -------------------------------------------------
// Methods
// -------------------------------------------------

export const clear 	= () => typesList = {};
export const add 	= (name: string, modelType: ModelTypeInterface) => typesList[name] = modelType;
export const get 	= (name: string) => typesList[name];
export const all	= () => typesList;

export default {
	clear,
	add,
	get,
	all,
};