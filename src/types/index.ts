// interfaces
import ModelTypeInterface from "../interfaces/modelType.ts";

// Types
import stringType from "./string/index.ts";

let typesList: Record<string, ModelTypeInterface> = {
	"string": stringType
};

// -------------------------------------------------
// Methods
// -------------------------------------------------

export const clear 	= () => typesList = {};
export const add 	= (name: string, modelType: ModelTypeInterface) => typesList[name] = modelType;
export const get 	= (name: string) => typesList[name];
export const all	= () => typesList;