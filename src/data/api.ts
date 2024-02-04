export interface Api {
    status: boolean
    code: number
    message: string
    data: dsb
}

export interface dsb {
    blueprint: string
}
