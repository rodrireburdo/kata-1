function probar() {
    const usuario = document.getElementById('usuario').value;
    const flag = document.getElementById('flag').value;
    verificarFlag(usuario, flag);
}

class SistemaFlags {
    constructor() {
        this.flags = {}; 
        this.cache = {}; 
        this.indiceRoundRobin = {}; 
    }

    agregarFlag(nombre, opciones, tipo, restricciones = {}) {
        this.flags[nombre] = {
            opciones,
            tipo,
            restricciones
        };
        this.indiceRoundRobin[nombre] = 0; 
    }

    obtenerFlag(usuario, flag) {
        const configuracion = this.flags[flag];

        if (configuracion.restricciones[usuario]) {
            return configuracion.restricciones[usuario];
        }

        if (this.cache[usuario] && this.cache[usuario][flag]) {
            return this.cache[usuario][flag];
        }

        let valor;
        if (configuracion.tipo === "roundRobin") {
            valor = this.roundRobin(flag);
        } else if (configuracion.tipo === "random") {
            valor = this.randomPeso(configuracion.opciones);
        }

        if (!this.cache[usuario]) {
            this.cache[usuario] = {};
        }
        this.cache[usuario][flag] = valor;

        return valor;
    }

    roundRobin(flag) {
        const configuracion = this.flags[flag];
        const opciones = configuracion.opciones;
        const indice = this.indiceRoundRobin[flag] % opciones.length;
        const valor = opciones[indice];
        this.indiceRoundRobin[flag]++;
        return valor;
    }

    randomPeso(opciones) {
        const aleatorio = Math.random();
        let acumulado = 0;

        for (const opcion of opciones) {
            acumulado += opcion.peso;
            if (aleatorio < acumulado) {
                return opcion.valor;
            }
        }
    }
}
const sistema = new SistemaFlags();

sistema.agregarFlag("RandomWeight", [ { valor: "A", peso: 0.3 },{ valor: "B", peso: 0.3 }, { valor: "C", peso: 0.4 }], "random", {"Cristian": "A", "Ayrton": "A", "Nicolas": "A", "Martin": "A"});

sistema.agregarFlag("RoundRobin", ["A", "B","C"], "roundRobin", {"Cristian": "A", "Ayrton": "A", "Nicolas": "A", "Martin": "A"});

function verificarFlag(usuario, flag) {
    const resultado = sistema.obtenerFlag(usuario, flag);
    document.getElementById("resultado").innerHTML += `Usuario ${usuario} obtiene ${flag}: ${resultado}<br>`;
}