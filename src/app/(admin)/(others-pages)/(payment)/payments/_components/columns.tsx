'use client';

import { ColumnDef } from "@tanstack/react-table";

export const  columns: ColumnDef<any>[] = [
    {
        accessorKey: "title",
        header: "강의명",
        cell: ({ row }) => (
            <div className="font-bold text-gray-900 dark:text-gray-100">
                {row.getValue("title")}
            </div>
        ),
    },
    {
        accessorKey: "totalRevenue",
        header: "총 결제액",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalRevenue"));
            return <div className="font-medium">₩{amount.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "totalRefund",
        header: "환불액",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalRefund"));
            return (
                <div className={amount > 0 ? "text-red-500" : "text-gray-400"}>
                    {amount > 0 ? `-₩${amount.toLocaleString()}` : "₩0"}
                </div>
            );
        },
    },
    {
        accessorKey: "netRevenue",
        header: "순 매출액",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("netRevenue"));
            return (
                <div className="font-bold text-[#465FFF]">
                    ₩{amount.toLocaleString()}
                </div>
            );
        },
    },
];