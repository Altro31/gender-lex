export function isFile(file: any): file is Express.Multer.File {
	return 'size' in file && !!file.size
}
