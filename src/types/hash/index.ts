// Packages
import config from "@acai/config";

// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

// Utils
import Hasher from "../../utils/hasher";

const hashType = {
	onCreate	: async (v: unknown, _, args?: {rounds?: number}) => {
		if (typeof v === "string") {
			const salt = config ? config.getConfig("APP_KEY", undefined):undefined;

			const hash = new Hasher(undefined, salt);
			await hash.hash(v);

			return hash;
		}

		return v;
	},
	onSave	: async (v: unknown) => {
		if (v.toString)
			return v.toString();

		return `${v}`;
	},
	onRetrieve	: async (v: unknown) => {
		return new Hasher(v as string);
	},
	onSerialize	: async (v: unknown) => {
		if (v.toString)
			return v.toString();

		return `${v}`;
	},
} as ModelTypeInterface;

export default hashType;