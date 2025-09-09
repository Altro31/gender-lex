export function isFile(file: any): file is File {
	return !!file.size
}
