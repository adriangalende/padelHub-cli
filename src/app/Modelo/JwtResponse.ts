export interface JwtResponse {
    dataUser:{
        sub:string,
        userId:number,
        clubId: number,
        role:string,
        email:string,
        token: string
    }

}