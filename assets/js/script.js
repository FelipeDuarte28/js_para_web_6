document.getElementById("btnConvertir").addEventListener("click", convertir);
    
async function indicadores(moneda) {
    try {
        const res = await fetch("https://mindicador.cl/api/");
        const data = await res.json();
        const dataDivisa = data[`${moneda}`];
        if (dataDivisa == undefined) {
            return alert("No existe la divisa en la base datos.")
        } else {
            return dataDivisa
        }
    } catch (err) {
        alert(err.message);
    }
}

async function convertir() {
    const inputCoin = document.getElementById("input-coin");
    const divisa = inputCoin.options[inputCoin.selectedIndex].value
    const datosDivisa = await indicadores(divisa)
    const valorDivisa = datosDivisa["valor"]
    const inputPesos = document.querySelector("#input-clp").value
    const conversion = inputPesos / valorDivisa

    document.getElementById("valorCambio").innerHTML = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valorDivisa);
    document.getElementById("resultado").innerHTML = new Intl.NumberFormat().format(conversion)

    renderGrafica();
}

////////////////////////////////////////////

async function historiaMoneda(divisa) {
    const endpoint = `https://mindicador.cl/api/${divisa}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    const infoRelevante = data.serie;

    return infoRelevante.slice(0, 10);
}

function prepararConfiguracionParaLaGrafica(data) {
    // Creamos las variables necesarias para el objeto de configuración
    const tipoDeGrafica = "line";
    const dias = data.map((data) => data.fecha.slice(0,10));
    const diasInvertidos = dias.reverse();
    const titulo = "Valor últimos 10 registros";
    const colorDeLinea = "red";
    const valores = data.map((data) => data.valor);
    const valoresInvertidos = valores.reverse();
    // Creamos el objeto de configuración usando las variables anteriores
    const config = {
        type: tipoDeGrafica,
        data: {
            labels: diasInvertidos,
            datasets: [
                {
                    label: titulo,
                    borderColor: colorDeLinea,
                    data: valoresInvertidos
                }
            ]
        }
    };
    return config;
}

async function renderGrafica() {
    const inputCoin = document.getElementById("input-coin");
    const divisa = inputCoin.options[inputCoin.selectedIndex].value
    const data = await historiaMoneda(divisa);
    const config = prepararConfiguracionParaLaGrafica(data);
    const chartDOM = document.getElementById("myChart");
    new Chart(chartDOM, config);
}