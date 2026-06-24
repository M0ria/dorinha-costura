/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.pedido.count();
  if (count > 0) {
    console.log("Banco de dados já contém registros. Seed ignorado.");
    return;
  }

  const pedidos = [
    {
      cliente: "Maria Silva",
      tipo: "Ajuste",
      descricao: null,
      material: 3.0,
      maoDeObra: 12.0,
      total: 15.0,
      data: new Date("2026-01-10T10:00:00Z"),
    },
    {
      cliente: "Ana Oliveira",
      tipo: "Confecção",
      descricao: null,
      material: 35.0,
      maoDeObra: 55.0,
      total: 90.0,
      data: new Date("2026-01-25T14:30:00Z"),
    },
    {
      cliente: "Beatriz Costa",
      tipo: "Conserto",
      descricao: null,
      material: 4.0,
      maoDeObra: 10.0,
      total: 14.0,
      data: new Date("2026-02-05T09:15:00Z"),
    },
    {
      cliente: "Clara Santos",
      tipo: "Reforma",
      descricao: null,
      material: 12.0,
      maoDeObra: 28.0,
      total: 40.0,
      data: new Date("2026-02-18T16:00:00Z"),
    },
    {
      cliente: "Diana Rodrigues",
      tipo: "Outro",
      descricao: "Customização de jaqueta jeans com patches",
      material: 8.0,
      maoDeObra: 22.0,
      total: 30.0,
      data: new Date("2026-03-02T11:00:00Z"),
    },
    {
      cliente: "Eliana Martins",
      tipo: "Ajuste",
      descricao: null,
      material: 2.0,
      maoDeObra: 10.0,
      total: 12.0,
      data: new Date("2026-03-15T15:45:00Z"),
    },
    {
      cliente: "Fernanda Lima",
      tipo: "Confecção",
      descricao: null,
      material: 42.0,
      maoDeObra: 68.0,
      total: 110.0,
      data: new Date("2026-03-29T10:30:00Z"),
    },
    {
      cliente: "Gabriela Souza",
      tipo: "Conserto",
      descricao: null,
      material: 5.0,
      maoDeObra: 12.0,
      total: 17.0,
      data: new Date("2026-04-08T14:20:00Z"),
    },
    {
      cliente: "Helena Gomes",
      tipo: "Reforma",
      descricao: null,
      material: 10.0,
      maoDeObra: 25.0,
      total: 35.0,
      data: new Date("2026-04-20T17:10:00Z"),
    },
    {
      cliente: "Iara Barbosa",
      tipo: "Ajuste",
      descricao: null,
      material: 3.0,
      maoDeObra: 15.0,
      total: 18.0,
      data: new Date("2026-05-02T09:00:00Z"),
    },
    {
      cliente: "Julia Pereira",
      tipo: "Confecção",
      descricao: null,
      material: 38.0,
      maoDeObra: 62.0,
      total: 100.0,
      data: new Date("2026-05-12T13:40:00Z"),
    },
    {
      cliente: "Karla Nascimento",
      tipo: "Conserto",
      descricao: null,
      material: 6.0,
      maoDeObra: 16.0,
      total: 22.0,
      data: new Date("2026-05-25T11:30:00Z"),
    },
    {
      cliente: "Larissa Fernandes",
      tipo: "Reforma",
      descricao: null,
      material: 15.0,
      maoDeObra: 30.0,
      total: 45.0,
      data: new Date("2026-06-03T16:15:00Z"),
    },
    {
      cliente: "Mariana Alencar",
      tipo: "Outro",
      descricao: "Bainha invisível e aplicação de botões especiais",
      material: 5.0,
      maoDeObra: 18.0,
      total: 23.0,
      data: new Date("2026-06-14T10:00:00Z"),
    },
    {
      cliente: "Natália Rocha",
      tipo: "Ajuste",
      descricao: null,
      material: 2.0,
      maoDeObra: 8.0,
      total: 10.0,
      data: new Date("2026-06-22T15:20:00Z"),
    },
    {
      cliente: "Patrícia Teixeira",
      tipo: "Confecção",
      descricao: null,
      material: 45.0,
      maoDeObra: 75.0,
      total: 120.0,
      data: new Date("2026-06-24T09:00:00Z"),
    }
  ];

  for (const pedido of pedidos) {
    await prisma.pedido.create({
      data: pedido,
    });
  }

  console.log("Banco de dados populado com sucesso (16 pedidos criados)!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
