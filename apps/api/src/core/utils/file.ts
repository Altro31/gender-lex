export function isFile(file: any): file is Express.Multer.File {
	return !!file.size
}
