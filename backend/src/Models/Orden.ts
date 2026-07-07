import mongoose from "mongoose";

const ordenSchema = new mongoose.Schema(
  {
    numero: {
      type: String,
      required: true,
      unique: true,
    },

    cliente: {
      type: String,
      required: true,
    },  

    fecha: {
      type: Date,
      required: true,
    },

    estado: {
      type: String,
      enum: [
        "Pendiente",
        "Facturada",
        "Cobrada",
        "Cancelada",
      ],
      default: "Pendiente",
    },

    total: {
      type: Number,
      required: true,
    },

    descripcion: {
      type: String,
    },

    archivo: {
      type: String,
    },

    factura: {
      type: String,
    },

    fechaFactura: {
      type: Date,
    },

    fechaCobro: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Orden",
  ordenSchema
);