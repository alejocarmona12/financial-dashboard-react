import { Schema, model } from "mongoose";

const CombustibleSchema = new Schema(
  {
    fecha: {
      type: Date,
      required: true,
    },

    tipo: {
      type: String,
      enum: ["camioneta", "tractor", "maquina"],
      required: true,
    },

    equipo: {
      type: String,
      required: true,
      trim: true,
    },

    operador: {
      type: String,
      required: true,
      trim: true,
    },

    litros: {
      type: Number,
      required: true,
      min: 0,
    },

    precioLitro: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    observaciones: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model(
  "Combustible",
  CombustibleSchema
);