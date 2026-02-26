import { Separator } from "@radix-ui/react-separator";


"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"



export interface Order {
  order_id: number;
  client_id: number;
  client_name: string;
  delivery_address: string;
//   deliveryDate: string;
//   items: number;
//   totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   destination: string;
//   warehouse: string;
//   driver?: string;
}

export interface Driver {
  driver_id?: number;
  id?: number;
  name?: string;
  driver_name?: string;
  phone?: string;
  driver_phone?: string;
  email?: string;
  driver_email?: string;
  [key: string]: any;
}



async function loadInitialOrders(){
    try{

        const user = await fetch("http://10.23.1.254:3000/api/orders");
        if(user.ok){
            const data = await user.json();
            console.log(data)
            return data as Order[];
        }else{
            throw new Error("Failed to fetch orders: " + user.statusText);
        }               
    }catch(error){
        console.error("Error fetching orders:", error);
        return [];
    }
}


async function updateDriver(orderId , driverId){
    try{

        const order = await fetch(`http://10.23.1.254:3000/api/orders/${orderId}` , {
            method :"PUT",
            body: JSON.stringify({
                driver_id : driverId,
                status: driverId ? "IN_TRANSIT" : "CREATED",

            }),
            headers : {
                "Content-Type" : "application/json"
            }
        });
          
    }catch(error){
        console.error("Error fetching drivers:", error);
        return [];
    }
}


async function loadInitialDrivers(){
    try{

        const user = await fetch("http://10.23.1.254:3000/api/drivers");
        if(user.ok){
            const data = await user.json();
            console.log("Drivers data:", data)
            return data as Driver[];
        }else{
            throw new Error("Failed to fetch drivers: " + user.statusText);
        }               
    }catch(error){
        console.error("Error fetching drivers:", error);
        return [];
    }
}

// Helper functions to extract driver properties (handles different API response formats)
function getDriverId(driver: Driver): string | number {
    return driver.id ?? driver.driver_id ?? '';
}

function getDriverName(driver: Driver): string {
    return driver.name ?? driver.driver_name ?? 'Unknown';
}

function getDriverPhone(driver: Driver): string {
    return driver.phone ?? driver.driver_phone ?? '';
}





// Mock driver data
const drivers = []



const getColumns = (
    assignedDrivers: Record<string, string | null>,
    onAssignDriver: (orderId: string, driverId: string | null) => void,
    drivers: any[] = []
): ColumnDef<Order>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))

            // Format the amount as a dollar amount.
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "assignedDriver",
        header: "Assigned Driver",
        cell: ({ row }) => {
            const order = row.original
            const assignedDriverId = assignedDrivers[order.order_id]
            const assignedDriver = drivers.length > 0 ? drivers.find(d => String(getDriverId(d)) === String(assignedDriverId)) : null

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            {assignedDriver ? getDriverName(assignedDriver) : "Assign Driver"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Select Driver</DropdownMenuLabel>
                        {drivers.length > 0 ? (
                            drivers.map((driver) => (
                                <DropdownMenuItem
                                    key={String(getDriverId(driver))}
                                    onClick={() => {
                                        onAssignDriver(String(order.order_id), String(getDriverId(driver)))
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span>{getDriverName(driver)}</span>
                                        <span className="text-xs text-gray-500">{getDriverPhone(driver)}</span>
                                    </div>
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>
                                <span className="text-gray-500">No drivers available</span>
                            </DropdownMenuItem>
                        )}
                        {assignedDriver && (
                            <>
                                <DropdownMenuLabel className="text-xs mt-2">Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        onAssignDriver(order.order_id, null)
                                    }}
                                    className="text-red-600"
                                >
                                    Unassign Driver
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(order.order_id)}
                            >
                                Copy Order ID
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                            
                                <a href="/orders/update">
                                    <DropdownMenuItem>
                                        View Order
                                    </DropdownMenuItem>
                                </a>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]





export default function WareHouseDashboardHome() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    
    // State for orders and drivers data
    const [orders, setOrders] = React.useState<Order[]>([])
    const [driversData, setDriversData] = React.useState<Driver[]>([])
    const [loading, setLoading] = React.useState(true)
    
    // State for assigned drivers
    const [assignedDrivers, setAssignedDrivers] = React.useState<Record<string, string | null>>({
        "3u1reuv4": "1",
        "5kma53ae": "2",
    })


    const [driver , setDriver] = React.useState<Driver | null>(null)


    // Load initial data on mount
    React.useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const [ordersResult, driversResult] = await Promise.all([
                    loadInitialOrders(),
                    loadInitialDrivers()
                ])
                setOrders(ordersResult)
                setDriversData(driversResult)
            } catch (error) {
                console.error("Error loading data:", error)
                setOrders([])
                setDriversData([])
            } finally {
                setLoading(false)
            }
        }
        
        loadData()
    }, [])

    const handleAssignDriver = (orderId: string, driverId: string | null) => {
        setDriver(driversData.find(d => String(getDriverId(d)) === String(driverId)) || null);
        setAssignedDrivers(prev => ({
            ...prev,
            [orderId]: driverId
        }))
        updateDriver(orderId , driverId).then(() => {alert("Driver assignment updated successfully!")}).catch(error => {
            console.error("Error updating driver assignment:", error);
            alert("Failed to update driver assignment: " + error.message);
        });
    }

    // Get columns with current state
    const columns = React.useMemo(
        () => getColumns(assignedDrivers, handleAssignDriver, driversData),
        [assignedDrivers, driversData]
    )

    const table = useReactTable({
        data: orders,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })



    return <>

        <div className="m-10 capitalize">
            <h1 className="text-5xl font-medium bg-linear-150 from-black to-white   inline-block bg-clip-text text-transparent">Ware House Dashboard</h1>
            <p>manage your branch orders here...</p>
            <Separator />
        </div>

        {loading && (
            <div className="m-10 text-center">
                <p className="text-lg text-gray-600">Loading orders and drivers...</p>
            </div>
        )}

        {!loading && (
        <div className="w-[90%] m-10 mt-0npx shadcn@latest add drawer">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
        )}

    </>
}