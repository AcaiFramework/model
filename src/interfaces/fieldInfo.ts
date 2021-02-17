export default interface FieldInfoInterface {
	name: string;
	type: string;
	args: Record<string, string | number | boolean | string[]>;
}