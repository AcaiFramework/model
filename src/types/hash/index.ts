// Packages
import config from "@acai/config";

// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

// Utils
import Hasher from "../../utils/hasher";

const hashType = {
	onCreate	: (v: unknown, _, args?: {rounds?: number}) => {
		if (typeof v === "string") {
			const salt = config ? config.getConfig("APP_KEY", undefined):undefined;

			const hash = new Hasher(undefined, salt || 10);
			hash.hash(v);

			return hash;
		}

		return v;
	},
	onSave	: (v: unknown) => {
		if (v.toString)
			return v.toString();

		return `${v}`;
	},
	onRetrieve	: (v: unknown) => {
		return new Hasher(v as string);
	},
	onSerialize	: (v: unknown) => {
		if (v.toString)
			return v.toString();

		return `${v}`;
	},
} as ModelTypeInterface;

export default hashType;