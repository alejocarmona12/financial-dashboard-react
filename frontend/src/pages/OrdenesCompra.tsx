const ordenes = [
    {
      id: 1,
      numero: "15021",
      cliente: "LDC Argentina",
      fecha: "20/06/2026",
      total: 2500000,
      estado: "Pendiente",
    },
    {
      id: 2,
      numero: "15022",
      cliente: "ACA",
      fecha: "21/06/2026",
      total: 1850000,
      estado: "Facturada",
    },
    {
      id: 3,
      numero: "15023",
      cliente: "AGD",
      fecha: "22/06/2026",
      total: 980000,
      estado: "Cobrada",
    },
  ];

  export default function OrdenesCompra() {
    return (
      <div>
        <h1>Ordenes de Compra</h1>
      </div>
    );
  }