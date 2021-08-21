var modalChart;
var myChart;
const getLengthObject = (obj) => {
  let lengthObject = 0;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      lengthObject++;
    }
  }
  return lengthObject;
};

const graficoModal = (data) => {
  var ctx = document.getElementById("modalChart").getContext("2d");
  if (modalChart) {
    modalChart.destroy();
  }
  modalChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [`muertos: ${data.deaths}`, `confirmados: ${data.confirmed}`],
      datasets: [
        {
          label: data.location,
          data: [data.deaths, data.confirmed],
          backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"], /////////////////////
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"], ///////////////////////////
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: data.location,
        },
      },
    },
  });
};

var openModal = (element) => {
  $("#exampleModal").modal("toggle");
  const getDetalle = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/countries/${element}`);
      const { data } = await res.json();

      if (getLengthObject(data) != 0) {
        var modalContent = document.getElementById("modalContent");
        modalContent.innerHTML = '<div><canvas id="modalChart"></canvas></div>';
        graficoModal(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "no hay informacion de este pais",
        });
        $("#exampleModal").modal("hide");
      }
    } catch (error) {
      console.log(`error : ${error}`);
    }
  };
  getDetalle();
};

const insertTable = (element) => {
  var tablaContent = document.getElementById("tablaContent");
  tablaContent.innerHTML = "";
  element.forEach((element) => {
    tablaContent.innerHTML += `
    <tr>
    <th scope="row">${element.location}</th>
    <td>${element.deaths}</td>
    <td>${element.confirmed}</td>
    <td><button class="btn btn-primary" style="width: 80%" onclick="openModal('${element.location}')">Detalle ${element.location}</button></td>
    </tr>
    
    `;
  });
};

const getData = async (filtro) => {
  console.log("filtro: " + filtro);
  try {
    const response = await fetch("http://localhost:3000/api/total");
    const { data } = await response.json();
    const mayoresA = data.filter(function (e) {
      return e.confirmed >= filtro;
    });
    // console.log(mayoresA);
    var titulos = [];
    var muertos = [];
    var confirmados = [];
    mayoresA.sort(function (a, b) {
      if (a.location > b.location) {
        return 1;
      }
      if (a.location < b.location) {
        return -1;
      }
      return 0;
    });

    mayoresA.forEach((element) => {
      confirmados.push(element.confirmed);
      muertos.push(element.deaths);
      titulos.push(element.location);
    });

    /////////////////grafico///////////////////////

    var ctx = document.getElementById("myChart").getContext("2d");
    if (myChart) {
      myChart.destroy();
    }
    myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: titulos,
        datasets: [
          {
            label: "confirmados",
            data: confirmados,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
          {
            label: "muertos",
            data: muertos,
            backgroundColor: ["rgba(54, 162, 235, 0.2)"],
            borderColor: ["rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Paises con mas de " + filtro + " confirmados",
          },
        },
      },
    });

    //////////////////////////tabla////////////////////////////

    insertTable(data);
  } catch (error) {
    console.log(`error : ${error}`);
  }
};
// let valor = document.getElementById("filtroConfirmados").value;
// if (valor == "") {
//   filtro = 5000000;
// } else {
//   filtro = valor;
// }

getData(100000);

$("#form").submit((e) => {
  e.preventDefault();
  let valor = document.getElementById("filtroConfirmados").value;

  if (valor == "") {
    filtro = 5000000;
  } else {
    filtro = valor;
  }

  getData(filtro);
});
