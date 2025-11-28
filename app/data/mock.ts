export const CLIENTS = [
    {
        id: "1",
        name: "Carlos Eduardo",
        phone: "(11) 99999-1234",
        email: "carlos@email.com",
        notes: "Cliente fiel, sempre compra Pods.",
        totalDebt: 150.00,
        totalPurchases: 1250.00,
        purchaseCount: 12,
        totalUnits: 8,
        status: "active" as const
    },
    {
        id: "2",
        name: "Ana Clara",
        phone: "(11) 98888-5678",
        email: "ana@email.com",
        notes: "",
        totalDebt: 0,
        totalPurchases: 450.00,
        purchaseCount: 4,
        totalUnits: 4,
        status: "active" as const
    },
    {
        id: "3",
        name: "Roberto Souza",
        phone: "(11) 97777-4321",
        email: "",
        notes: "Atrasou pagamento mês passado.",
        totalDebt: 580.00,
        totalPurchases: 2100.00,
        purchaseCount: 15,
        totalUnits: 12, // Eligible for reward
        status: "blocked" as const
    },
    {
        id: "4",
        name: "Mariana Lima",
        phone: "(11) 96666-8765",
        email: "mari@email.com",
        notes: "",
        totalDebt: 0,
        totalPurchases: 85.00,
        purchaseCount: 1,
        totalUnits: 1,
        status: "active" as const
    },
];
