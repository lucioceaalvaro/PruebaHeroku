"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const autos_1 = require("../model/autos");
const database_1 = require("../database/database");
class DatoRoutes {
    constructor() {
        this.getAutos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield autos_1.Autos.find({});
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.getAuto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const valor = req.params.valor;
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield autos_1.Autos.aggregate([
                    {
                        $match: { "_matricula": valor }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
        });
        this.crearAuto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const auto = new autos_1.Autos(req.body);
            console.log(auto);
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                //let pSchema : any
                //pSchema.save() De aqui para abajo esta bien*/
                /*pSchema = new Autos({
                    _tipoObjeto: auto._tipoObjeto,
                    _precioBase: auto._precioBase,
                    _potenciaMotor: auto._potenciaMotor,
                    _traccion: auto._traccion,
                    _matricula: auto._matricula
                })*/
                console.log(mensaje);
                //await pSchema.save()
                yield auto.save()
                    .then((doc) => res.send("documento salvado " + doc))
                    .catch((err) => res.send(err));
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.modificarAuto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //const valor = req.params.valor
            //console.log(valor)
            //const modificar = req.params.modificar
            const auto = new autos_1.Autos(req.body);
            console.log(auto);
            console.log(auto);
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield autos_1.Autos.findOneAndUpdate({ _matricula: auto._matricula }, {
                    _tipoObjeto: auto._tipoObjeto,
                    _precioBase: auto._precioBase,
                    _potenciaMotor: auto._potenciaMotor,
                    _traccion: auto._traccion,
                }, { new: true });
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.modificarAuto2 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const matriculaP = req.params.matriculaP;
                const cambioP = req.params.cambioP;
                const query = yield autos_1.Autos.findOneAndUpdate({ _matricula: matriculaP }, {
                    _potenciaMotor: cambioP
                }, { new: true });
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.deleteAutos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const matricula = req.params;
            yield database_1.db.conectarBD();
            yield autos_1.Autos.findOneAndDelete({
                _matricula: matricula
            })
                .then((doc) => res.send("Ha ido bien" + doc))
                .catch((err) => res.send("Error: " + err));
            yield database_1.db.desconectarBD();
        });
        this._router = (0, express_1.Router)();
    }
    get router() {
        return this._router;
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
    misRutas() {
        this._router.get('/autos', this.getAutos);
        this._router.get('/autos/:valor', this.getAuto);
        this._router.post('/auto', this.crearAuto);
        this._router.put('/modificar', this.modificarAuto);
        this._router.put('/mod/:matriculaP/:cambioP', this.modificarAuto2);
        this._router.delete('/auto/:matricula', this.deleteAutos);
        //this._router.put('/autos/:matriculax/:cambio', this.updatePm)
    }
}
const obj = new DatoRoutes();
obj.misRutas();
exports.routes = obj.router;
