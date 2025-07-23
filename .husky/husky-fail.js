const path = process.cwd()
let blank = ' '.repeat(path.length)
const regex = /ñ/g
const positions = []
let match

while ((match = regex.exec(path)) !== null) {
	positions.push(match.index)
}

for (const pos of positions) {
	blank = `${blank.slice(0, pos)}^${blank.slice(pos + 1)}`
}

console.log('WARNING: Maybe husky installation fails because the project path:')
console.log(`--> ${path}`)
if (positions.length) console.log(`    ${blank}`)
console.log('should contains special characters.')
console.log('Try: ')
console.log('• moving the project to another directory, or')
console.log("• removing those special characters from the project's path")
