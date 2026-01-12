export function HttpError() {
    console.log("Hola")
    return (a: any, b: any) => {
        console.log(a, b)
    }
}

export interface IHttpTaggedError {
    status: number
    statusText: string
    toResponse?(): Response
}
