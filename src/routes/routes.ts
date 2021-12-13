import {Request, Response, Router } from 'express'
import { Autos, iAuto } from '../model/autos'
import { db } from '../database/database'

class DatoRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getAutos = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await Autos.find({})
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private getAuto = async (req: Request, res: Response) => {
        const valor = req.params.valor
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await Autos.aggregate([
                {
                  $match:{"_matricula" : valor}
      
                }])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

    }

    private crearAuto = async (req: Request, res: Response) => {// probar meter el auto con el save
        const auto = new Autos(req.body)
        console.log(auto)
        await db.conectarBD()
        .then( async (mensaje) => {
            //let pSchema : any

            
            //pSchema.save() De aqui para abajo esta bien*/
            /*pSchema = new Autos({
                _tipoObjeto: auto._tipoObjeto,
                _precioBase: auto._precioBase,
                _potenciaMotor: auto._potenciaMotor,
                _traccion: auto._traccion,
                _matricula: auto._matricula
            })*/

            console.log(mensaje)
            //await pSchema.save()
            await auto.save()
            .then ((doc:any) => res.send("documento salvado "+doc))
            .catch((err:any) => res.send(err))
        })

        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private modificarAuto = async (req: Request, res: Response) => {
        //const valor = req.params.valor
        //console.log(valor)
        //const modificar = req.params.modificar
        const auto = new Autos(req.body)
        console.log(auto)
        console.log(auto)
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await Autos.findOneAndUpdate(
                {_matricula: auto._matricula},
                {
                    _tipoObjeto: auto._tipoObjeto,
                    _precioBase: auto._precioBase,
                    _potenciaMotor: auto._potenciaMotor,
                    _traccion: auto._traccion, 
                },
                {new: true}
            )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private modificarAuto2 = async (req: Request, res: Response) => {

        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const matriculaP = req.params.matriculaP
            const cambioP = req.params.cambioP
            const query  = await Autos.findOneAndUpdate(
                {_matricula: matriculaP},
                {
                    _potenciaMotor: cambioP
                },
                {new: true}
            )
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }
    private deleteAutos = async (req: Request, res: Response) => {
        const matricula =req.params.matricula
        await db.conectarBD()

        await Autos.findOneAndDelete(
            {
                _matricula: matricula
            }
        )
        .then((doc:any)=>res.send("Ha ido bien"+doc))
        .catch((err:any)=> res.send("Error: "+err))
        await db.desconectarBD()
    }
    /*private updatePm = async (req: Request, res: Response) => {
        await db.conectarBD()
            .then(async (mensaje) => {
                //let cambio: number = 0
                const {matriculax, cambio} = req.params
                console.log(mensaje)
                const query = await Autos.findOneAndUpdate(
                    {_matricula: matriculax}, {_potenciaMotor: cambio}
                )
        res.json(query)
    })
        .catch((mensaje) => {
    res.send(mensaje)
})

db.desconectarBD()
    }*/



    misRutas(){
        this._router.get('/autos', this.getAutos)
        this._router.get('/autos/:valor', this.getAuto)
        this._router.post('/auto', this.crearAuto)
        this._router.put('/modificar', this.modificarAuto)
        this._router.put('/mod/:matriculaP/:cambioP', this.modificarAuto2)
        this._router.delete('/auto/:matricula', this.deleteAutos)
        //this._router.put('/autos/:matriculax/:cambio', this.updatePm)
    }

}

const obj = new DatoRoutes()
obj.misRutas()
export const routes = obj.router
