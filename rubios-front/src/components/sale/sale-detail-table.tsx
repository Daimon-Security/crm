import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import TableResponsive from "../common/table-responsive"
import { MdDelete } from "react-icons/md";
import { SaleDetail } from "../../entities/sale-detail";
import { SaleDetailCreateDto } from "../../entities/dto/sale-detail-create-dto";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

interface SaleDetailTableProps{
    seleDetails:any,
    onRemoveProduct: (index:any, total: any)=>void;
    disabled: boolean
}

export const SaleDetailTable = ({saleDetails, onRemoveProduct, disabled}: any) => {
    const formatNumber = useNumberFormatter();
    return (
        <Table className="table table-bordered bg-white my-2">
            <Thead>
                <Tr>
                    <Th>Cod</Th>
                    <Th>Descripción</Th>
                    <Th>Cant.</Th>
                    <Th>Precio</Th>
                    <Th>Total</Th>
                    <Th></Th>
                </Tr>
            </Thead>
            <Tbody>
                {saleDetails.length>0?(
                    saleDetails.map((detail: SaleDetailCreateDto, index: any)=>(
                        <Tr key={index}>
                        <Td>{detail.code}</Td>
                        <Td>{detail.productName}</Td>
                        <Td>{detail.quantity}</Td>
                        <Td>{formatNumber(detail.price)}</Td>
                        <Td>{formatNumber(detail.total)}</Td>
                        <Td><button className="btn btn-danger me-1 mb-1"
                        disabled={disabled}
                         onClick={() => { onRemoveProduct(index, detail.total)}} title="Eliminar"><MdDelete /></button></Td>
                    </Tr>
                    ))
                )
                   :(
                    <Tr>
                    <Td></Td>
                    <Td>no hay productos agregados</Td>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                </Tr>
                   )
                }
                
            </Tbody>
        </Table>
    )
};

export default SaleDetailTable;